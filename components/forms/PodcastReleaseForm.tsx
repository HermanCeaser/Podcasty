/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Required } from "../ui/required";
import CategorySelect from "../CategorySelect";

import Categories from "@/data/categories";

type ReleaseFormData = {
  title: string;
  category: string;
  description: string;
  artwork: File | null;
};

type ReleaseFormProps = ReleaseFormData & {
  fileRef: React.RefObject<HTMLDivElement>;
  onChange: (data: any) => void;
  updateFields: (fields: Partial<ReleaseFormData>) => void;
};

const PodcastReleaseForm = ({
  title,
  artwork,
  fileRef,
  category,
  description,
  onChange,
  updateFields,
}: ReleaseFormProps) => {


  return (
    <>
      <div className="grid w-full max-w-md items-center gap-2.5 mt-3">
        <Label htmlFor="title">
          Podcast Name <Required>*</Required>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Podcast Title"
          name="title"
          value={title}
          autoFocus
          required
          onChange={(e) => updateFields({ title: e.target.value })}
        />
      </div>

      <div className="grid w-full max-w-md items-center gap-2.5 mt-3">
        <Label htmlFor="coverImg">
          Artwork <Required>*</Required>
        </Label>
        <div className="max-w-md overflow-hidden items-center">
          <div
            tabIndex={-1}
            ref={fileRef}
            className=" focus:border-red-400 max-w-md p-6 mb-4 bg-primary-100 border-dashed border-2 border-primary/400 rounded-lg items-center mx-auto text-center cursor-pointer"
          >
            <input
              name="artwork"
              id="coverImg"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onChange}
              // required
            />
            <label htmlFor="coverImg" className="cursor-pointer">
              {artwork ? (
                <div className="max-w-md p-6 mb-4 mx-auto text-center border border-primary/40">
                  <img
                    className="max-h-48 rounded-lg mx-auto"
                    src={URL.createObjectURL(artwork)}
                    // width={192}
                    // height={192}
                    alt="Artwork Preview"
                  />
                </div>
              ) : (
                <div className="max-w-md p-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-primary-background/70 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  <p className="font-normal text-sm text-slate-400 md:px-6">
                    <b className="text-primary/60">
                      {" "}
                      Click here to select files
                    </b>{" "}
                  </p>
                </div>
              )}

              <h5 className="mb-2 text-xl font-bold tracking-tight text-slate-700">
                {artwork ? "Change" : "Upload"} Artwork
              </h5>
              <p className="font-normal text-sm text-slate-400 md:px-6">
                Choosen artwork size should be less than{" "}
                <b className="text-primary/60">3mbs</b>
              </p>
              <p className="font-normal text-sm text-slate-400 md:px-6">
                and should be in{" "}
                <b className="text-primary/60">JPG, PNG, or GIF</b> format.
              </p>
              <span
                id="filename"
                className="text-primary/50 bg-primary/10 z-50"
              >
                {artwork ? artwork.name : "No File Chosen"}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid max-w-md w-full gap-2.5 mt-3">
        <Label htmlFor="category">
          Category <Required>*</Required>{" "}
        </Label>
        <CategorySelect
          name="category"
          options={Categories}
          isRequired={true}
          selected={category}
          onValueChange={(value) => updateFields({ category: value })}
        />
      </div>

      <div className="grid max-w-md w-full gap-2.5 mt-3">
        <Label htmlFor="description">Description </Label>
        <Textarea
          value={description}
          name="description"
          placeholder="Type your message here."
          id="description"
          onChange={(e) => updateFields({ description: e.target.value })}
        />
      </div>
    </>
  );
};

export default PodcastReleaseForm;
