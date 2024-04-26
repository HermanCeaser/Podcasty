/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useMemo, useCallback } from "react";

import { useToast } from "./ui/use-toast";
import { SubmitButton } from "./SubmitButton";

import { savePodcast } from "@/actions/podcastAction";

import useMultistepForm from "@/hooks/useMultistepForm";
import PodcastReleaseForm from "./forms/PodcastReleaseForm";
import EpisodeForm from "./forms/EpisodeForm";
import { Button } from "./ui/button";
import { set } from "mongoose";
import { FileRejection, useDropzone } from "react-dropzone";

export type Episode = {
  title: string;
  description?: string;
  duration: number;
  audio: File;
};

type Data = {
  title: string;
  artwork: File | null;
  description: string;
  category: string;
  artist?: string;
  episodes: Episode[];
};

const INITIAL_FORM_DATA = {
  title: "",
  artwork: null,
  description: "",
  category: "",
  artist: "",
  episodes: [],
};

function PodcastCreator() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileWrapper = useRef<HTMLDivElement>(null!);
  const [data, setFormData] = useState<Data>(INITIAL_FORM_DATA);
  const { toast } = useToast();


  const updateFields = useCallback((fields: Partial<Data>) => {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  }, []);

  const handleImgChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      updateFields({ artwork: img });
    },
    [toast, updateFields]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[], _fileRejections: FileRejection[]) => {
      if (acceptedFiles?.length) {
        // Check if the file already exists in episodes
        const newEpisodes = acceptedFiles.filter((file) => {
          return !data.episodes.some((episode) => file.name === episode.audio.name);
        });

        const uploadedEpisodesWithDurations = await Promise.all(
          newEpisodes.map(async (file) => {
            const audio = new Audio(URL.createObjectURL(file));
            await new Promise<void>((resolve) => {
              audio.addEventListener("loadedmetadata", () => {
                resolve();
              });
            });
            const duration = audio.duration;
            audio.remove();
            return { audio: file, duration, title: file.name.split(".")[0] };
          })
        );

        

        (function () {
          updateFields({
            episodes: [...data.episodes, ...uploadedEpisodesWithDurations],
          });
        })();
      }
      // Do something with the files
      // console.log(acceptedFiles);
    },
    [data.episodes, updateFields]
  );



  const { steps, currentStepIndex, isFirstStep, isLastStep, back, next, step } =
    useMultistepForm([<PodcastReleaseForm
      {...data}
      onChange={handleImgChange}
      fileRef={fileWrapper}
      updateFields={updateFields}
    />, <EpisodeForm episodes={data.episodes} updateFields={updateFields} onDrop={onDrop} />]);

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

    if (currentStepIndex === 1) {
      // If this is the second step
      // ensure all episodes have audio, title and description
      const episodes = data.episodes;
      if (episodes.length === 0) {
        toast({
          title: "Error",
          description: "No episodes found! ",
        });
        return;
      }

      const hasEmptyFields = episodes.some(
        (episode) => !episode.audio || !episode.title 
      );
      if (hasEmptyFields) {
        toast({
          title: "Error",
          description: "Please fill in all fields for all episodes!",
        });
        return;
      }
    }

    if (!isLastStep) return next();

    const fData = new FormData();
    fData.append("title", data.title);
    fData.append("artwork", data.artwork!);
    fData.append("description", data.description!);
    fData.append("category", data.category);

    data.episodes.forEach((episode) => {
      fData.append("episodes", episode.audio);
    });
    
    fData.append("episode_metadata", JSON.stringify(data.episodes));

    // return;

    const res = await savePodcast(fData);
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
