"use server";

import fs from "node:fs/promises";
import path from "node:path";
import os, { tmpdir } from "node:os";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";
import Podcast, { MediaType, PodcastType } from "@/models/podcastModel";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/**
 * Returns Cloudinary Response in the Format
 *{
 * asset_id: 'e025d4b2d0cfbfdda799d57b5c4b5736',
 *  public_id: 'podcaster_uploads/dokxvdwb9cvh6ogaouvd',
 *  version: 1712864421,
 *  version_id: '9e98aafd1df494efe21c6a51a1ab22c0',
 *  signature: 'f691b4364e17019a2bf246f3ef36b75c8a9266c5',
 *  width: 306,
 *  height: 260,
 *  format: 'png',
 *  resource_type: 'image',
 *  created_at: '2024-04-11T19:40:21Z',
 *  tags: [],
 *  bytes: 40084,
 *  type: 'upload',
 *  etag: 'd86ea78162489c580141e20c30246fbc',
 *  placeholder: false,
 *  url: 'http://res.cloudinary.com/hermanceaser/image/upload/v1712864421/podcaster_uploads/dokxvdwb9cvh6ogaouvd.png',
 *  secure_url: 'https://res.cloudinary.com/hermanceaser/image/upload/v1712864421/podcaster_uploads/dokxvdwb9cvh6ogaouvd.png',
 *  folder: 'podcaster_uploads',
 *  original_filename: 'f30e2bef-fed1-4a04-927a-4fcb769dbe9d',
 *  api_key: '466216358877983'
 *}
 */
const uploadToCloud = async (filepath: string) => {
  const result = await cloudinary.uploader.upload(filepath, {
    folder: "podcaster_uploads",
  });
  return result;
};

const saveToLocal = async (formData: FormData) => {
  const img = formData.get("artwork") as File;

  const imgPromise = img.arrayBuffer().then(async (data) => {
    const buffer = Buffer.from(data);
    const name = crypto.randomUUID();
    const ext = img.name.split(".").pop();
    let uploadDir = "";

    if (process.env.NODE_ENV === "production") {
      uploadDir = path.join(os.tmpdir(), `/${name}.${ext}`);
    } else {
      uploadDir = path.join(process.cwd(), "public/images/", `/${name}.${ext}`);
    }

    if (uploadDir) {
      await fs.writeFile(uploadDir, buffer);
    }
    return { filepath: uploadDir, filename: img.name };
  });

  return imgPromise;
};

const saveToDB = async (formData: FormData, artwork: any) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const secure_url = artwork.secure_url;
  const artist = "Herman Ceaser";
  const genre = "History";

  const podcast = new Podcast({
    title,
    description,
    artwork: {
      secure_url: secure_url,
      public_id: artwork.public_id,
    },
    category,
    artist,
    genre,
    language: "English",
    type: PodcastType.EPISODIC,
    episodes: [
      {
        name: "Episode 1",
        description: "This is episode 1",
        audio: {
          secure_url: "secure_rl1",
          public_id: 1,
          type: MediaType.AUDIO,
        },
      },
      {
        name: "Episode 2",
        description: "This is episode 2",
        audio: {
          secure_url: "secure_rl2",
          public_id: 2,
          type: MediaType.AUDIO,
        },
      },
      {
        name: "Episode 3",
        description: "This is episode 3",
        audio: {
          secure_url: "secure_rl3",
          public_id: 3,
          type: MediaType.AUDIO,
        },
      },
    ],
  });

  await podcast.save();
};

const delay = (delayInMs: number) => {
  return new Promise((resolve) => { setTimeout(resolve, delayInMs) });
}

// Create a server action to save podcast to db (Mongo DB) receiving form data as an argument
export const savePodcast = async (formData: FormData) => {
  try {
    // Upload to tmp dir
    const filepath = await saveToLocal(formData);

    // then upload to cloudinary
    uploadToCloud(filepath.filepath).then((artwork) => {
      // then save to db
      saveToDB(formData, artwork)
        .then(() => {
          console.log("Podcast saved to DB!");
        })
        .catch((error) => {
          console.error(error);
        });
    });

    // delay for 2 seconds and delete from tmpdir
    // await delay(2000);
    console.log("Deleting from tmp dir");
    // delete from tmp dir
    await fs.unlink(filepath.filepath);

    revalidatePath("/");

  } catch (error: any) {
    console.error(error);
    return {
      error: true,
      message: error.message,
    };
  }
};

export const deleteImgFromCloud = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    return {
      error: true,
      message: error.message,
    };
  }
};


