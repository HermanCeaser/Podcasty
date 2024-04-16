/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";

import { useToast } from "./ui/use-toast";
import { SubmitButton } from "./SubmitButton";

import { savePodcast } from "@/actions/podcastAction";

import useMultistepForm from "@/hooks/useMultistepForm";
import PodcastReleaseForm from "./forms/PodcastReleaseForm";
import EpisodeListingForm from "./forms/EpisodeListingForm";
import { Button } from "./ui/button";
import { set } from "mongoose";

type Data = {
  title: string;
  artwork: File | null;
  description: string;
  category: string;
  artist?: string;
  episodes?: {
    title: string;
    description: string;
    duration: string;
    audio: File | null;
  }[];
};

const INITIAL_FORM_DATA = {
  title: "",
  artwork: null,
  description: "",
  category: "",
  artist: "",
};

function PodcastCreator() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileWrapper = useRef<HTMLDivElement>(null!);
  const [data, setFormData] = useState<Data>(INITIAL_FORM_DATA);

  const updateFields = (fields: Partial<Data>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  };

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

    updateFields({artwork: img});
  };

  const { steps, currentStepIndex, isFirstStep, isLastStep, back, next, step } =
    useMultistepForm([
      <PodcastReleaseForm
        {...data}
        onChange={handleImgChange}
        fileRef={fileWrapper}
        updateFields={updateFields}
      />,
      <EpisodeListingForm />,
    ]);

  const { toast } = useToast();

  const handleFormSubmit = async (formData: FormData) => {
    if (isFirstStep) {
      if (!data.artwork) {
        fileWrapper.current.focus();
        toast({
          title: "Error",
          description: "The artwork for the podcast is required!",
        });
        return;
      }
    }

    if (!isLastStep) return next();

    return console.log(formData);

    const res = await savePodcast(formData);
    // if (res?.error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to Save Podcast!",
    //   });
    // } else {
    //   formRef.current?.reset();
    //   setImgCover(null);
    // }
  };
  return (
    <div className="mt-3 relative">
      <form action={handleFormSubmit} ref={formRef}>
        <div className="absolute top-0.5 right-1">
          {currentStepIndex + 1} / {steps.length}
        </div>
        {step}
        <div className="flex gap-1 justify-between mt-4">
          {!isFirstStep && (
            <Button type="button" onClick={back}>
              Back
            </Button>
          )}
          <SubmitButton isLastStep={isLastStep} />
        </div>
      </form>
    </div>
  );
}

export default PodcastCreator;
