"use server";

import fs from "node:fs/promises";
import path from "node:path";

const saveToLocal = async (formData: FormData) => {
  console.log(formData);
  const img = formData.get("artwork") as File;
  if (img) {
    img.arrayBuffer().then(async (data) => {
      const buffer = Buffer.from(data);
      const name = crypto.randomUUID();
      const ext = img.name.split(".").pop();
      await fs.writeFile(
        path.join(process.cwd(), "public/images/", `/${name}.${ext}`),
        buffer
      );
    });
  }
};

// Create a server action to save podcast to db (Mongo DB) receiving form data as an argument
export const savePodcast = async (formData: FormData) => {
  try {
    await saveToLocal(formData);
  } catch (error: any) {
    console.error(error);
    return {
      error: true,
      message: error.message,
    };
  }
};
