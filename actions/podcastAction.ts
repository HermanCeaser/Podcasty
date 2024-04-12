"use server";

import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

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
  console.log(formData);
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

// Create a server action to save podcast to db (Mongo DB) receiving form data as an argument
export const savePodcast = async (formData: FormData) => {
  try {
    // Upload to tmp dir
    const filepath = await saveToLocal(formData);
    // then upload to cloudinary
    const artwork = await uploadToCloud(filepath.filepath);

    //delete from tmp dir   
    await fs.unlink(filepath.filepath);

    console.log(artwork);
    revalidatePath("/");
    // console.log(filepath);
  } catch (error: any) {
    console.error(error);
    return {
      error: true,
      message: error.message,
    };
  }
};
