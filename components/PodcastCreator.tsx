/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import Image from "next/image";
import { SubmitButton } from "./SubmitButton";
import { Textarea } from "./ui/textarea";
import { Required } from "./ui/required";
import { savePodcast } from "@/actions/podcastAction";

function PodcastCreator() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileWrapper = useRef<HTMLDivElement>(null!);
  const [imgCover, setImgCover] = useState<File | null>(null);

  const { toast } = useToast();

  const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      toast({
        title: "Error",
        description: "No file selected",
      });
      return;
    }

    // check ifaction={handle} file is an image and is less than 3 Mbs
    const img = files[0];
    if (!img.type.startsWith("image/") || img.size > 1024 * 3072) {
      toast({
        title: "Error",
        description: "File Size is too big Or file is not an image",
      });
      return;
    }

    setImgCover(img);
  };

  const handleFormSubmit = async (formData: FormData) => {
    
    if (!imgCover) {
      fileWrapper.current.focus();
      toast({
        title: "Error",
        description: "The artwork for the podcast is required!",
      });
      return;
    }
    
    const res = await savePodcast(formData);
    // if (res.ok) {
    //   toast({
    //     title: "Success",
    //     description: "Podcast created successfully!",
    //   });
    //   formRef.current?.reset();
    //   setImgCover(null);
    // }
  };
  return (
    <div className="mt-3">
      <form action={handleFormSubmit} ref={formRef}>
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
          <Label htmlFor="title">
            Podcast Name <Required>*</Required>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Podcast Title"
            name="title"
            required
          />
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
          <Label htmlFor="coverImg">
            Artwork <Required>*</Required>
          </Label>
          <div className="grid w-full items-center gap-1.5">
            <div className="max-w-sm mx-auto  overflow-hidden items-center">
              <div
                tabIndex={-1}
                ref={fileWrapper}
                className=" focus:border-red-400 max-w-sm p-6 mb-4 bg-slate-100 border-dashed border-2 border-slate-400 rounded-lg items-center mx-auto text-center cursor-pointer"
              >
                <input
                  name="artwork"
                  id="coverImg"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImgChange}
                  // required
                />
                <label htmlFor="coverImg" className="cursor-pointer">
                  {imgCover ? (
                    <div className="max-w-sm p-6 mb-4 mx-auto text-center border border-slate-300">
                      <img
                        className="max-h-48 rounded-lg mx-auto"
                        src={URL.createObjectURL(imgCover)}
                        // width={192}
                        // height={192}
                        alt="Artwork Preview"
                      />
                    </div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-8 h-8 text-slate-700 mx-auto mb-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  )}

                  <h5 className="mb-2 text-xl font-bold tracking-tight text-slate-700">
                    Upload picture
                  </h5>
                  <p className="font-normal text-sm text-slate-400 md:px-6">
                    Choose photo size should be less than{" "}
                    <b className="text-slate-600">2mb</b>
                  </p>
                  <p className="font-normal text-sm text-slate-400 md:px-6">
                    and should be in{" "}
                    <b className="text-slate-600">JPG, PNG, or GIF</b> format.
                  </p>
                  <span
                    id="filename"
                    className="text-slate-500 bg-slate-200 z-50"
                  >
                    {imgCover ? imgCover.name : "No File Chosen"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-1.5">
          <Label htmlFor="description">Description </Label>
          <Textarea
            name="description"
            placeholder="Type your message here."
            id="description"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}

export default PodcastCreator;

{
  /* Preview Image  */
}
{
  /* {imgCover && (
  <div className="max-w-sm p-6 mb-4 mx-auto text-center border border-slate-300">
    <img
      className="max-h-48 rounded-lg mx-auto"
      src={URL.createObjectURL(imgCover)}
      // width={192}
      // height={192}
      alt="Artwork Preview"
    />
  </div>
)} */
}
