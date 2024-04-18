import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

import { Label } from "../ui/label";
import { Required } from "../ui/required";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Clock3,
  DeleteIcon,
  EditIcon,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Trash2Icon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { set } from "mongoose";
import { formatDuration } from "@/lib/utils";

type UploadedEpisode = {
  episodeBlob: File;
  duration: number;
  description?: string;
  title?: string;
};

let a: HTMLAudioElement | null;
const EpisodeForm = () => {
  const [episodes, setEpisodes] = useState<UploadedEpisode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    null
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[], _fileRejections: FileRejection[]) => {
      if (acceptedFiles?.length) {
        // Check if the file already exists in episodes
        const newEpisodes = acceptedFiles.filter((file) => {
          return !episodes.some(
            (episode) => file.name === episode.episodeBlob.name
          );
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
            return { episodeBlob: file, duration };
          })
        );

        // Add the new files to the episodes array
        setEpisodes((prevEpisodes) => {
          return [...prevEpisodes, ...uploadedEpisodesWithDurations];
        });
      }
      // Do something with the files
      // console.log(acceptedFiles);
    },
    [episodes]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "audio/*": [],
    },
    maxFiles: 10,
    maxSize: 1024 * 10000, //10 mbs
    onDrop,
  });

  useEffect(() => {
    if (a) {
      a.pause();
      a = null;
      setIsPlaying(false);
    }
    if (playingEpisode) {
      a = new Audio(playingEpisode);
      a.play();
      setIsPlaying(true);
      a.onended = () => {
        setIsPlaying(false);
      };
    }
  }, [playingEpisode]);

  const handlePlay = (src: string, currentEpisode: number) => {
    if (src) {
      setPlayingEpisode(src);
      setCurrentPlayingIndex(currentEpisode);
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    if (playingEpisode) {
      setPlayingEpisode(null);
      setCurrentPlayingIndex(null);
      a?.pause();
    }
  };

  // calculate the totalDuration of the episodes
  const totalDuration: number = episodes.reduce((total, episode) => {
    return total + Number(episode?.duration);
  }, 0);

  return (
    <div>
      <h2 className="text-2xl">Episode Details</h2>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="max-w-md overflow-hidden items-center">
          <div
            {...getRootProps()}
            tabIndex={-1}
            className=" focus:border-red-400 max-w-md p-6 mb-4 bg-primary-100 border-dashed border-2 border-primary/400 rounded-lg items-center mx-auto text-center cursor-pointer"
          >
            <Input
              name="episodes[]"
              id="episodes"
              type="file"
              className="hidden"
              accept="audio/*"
              multiple
              {...getInputProps()}
              // onChange={onChange}
              // required
            />
            <label htmlFor="coverImg" className="cursor-pointer">
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
                    Drag n drop some files here OR click to select files
                  </b>{" "}
                </p>
              </div>

              <h5 className="mb-2 text-xl font-bold tracking-tight text-slate-700">
                Upload Audio Files
              </h5>
              <p className="font-normal text-sm text-slate-400 md:px-6">
                Choosen audio file size should be less than{" "}
                <b className="text-primary/60">10 mbs</b>
              </p>
              <p className="font-normal text-sm text-slate-400 md:px-6">
                and should be in{" "}
                <b className="text-primary/60">mp3, aac, or wav</b> format.
              </p>
              <span
                id="filename"
                className="text-primary/50 bg-primary/10 z-50"
              >
                {episodes && episodes.length > 0
                  ? `${episodes.length} Files Selected`
                  : "No File Selected"}
              </span>
            </label>
          </div>
        </div>

        <div className="col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Episode list</CardTitle>
              <CardDescription>Episodes and Metadata</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <!-- Show when there are no episodes --> */}
              {episodes && episodes.length === 0 && (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-16 md:p-12">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                      No Episodes added
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You can add episodes by dragging and dropping audio files
                      to the right.
                    </p>
                  </div>
                </div>
              )}

              {/* <!-- Show when Episodes are added --> */}
              {episodes && episodes.length > 0 && (
                <Table>
                  
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Order</TableHead>
                      <TableHead className="w-[50px]">Play</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>MetaData</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {episodes.map((episode, idx) => {
                      return (
                        <TableRow key={idx}>
                          <TableCell className="font-medium w-[50px]">
                            {idx + 1}
                          </TableCell>
                          <TableCell className="w-[50px] p-0 font-medium">
                            {isPlaying && currentPlayingIndex === idx ? (
                              <Button variant="ghost" onClick={handlePause}>
                                <PauseCircle
                                  fill="#ec48d1"
                                  stroke="#f0f7ff"
                                  className="h-10 w-10"
                                  strokeWidth={1}
                                />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                onClick={() => {
                                  // setIsPlaying(true);
                                  handlePlay(
                                    URL.createObjectURL(episode.episodeBlob),
                                    idx
                                  );
                                }}
                              >
                                <PlayCircle
                                  fill="#ec48d1"
                                  stroke="#f0f7ff"
                                  className="h-10 w-10"
                                  strokeWidth={1}
                                />
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>{episode.episodeBlob.name}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Duration:{" "}
                              </span>
                              {episode.duration
                                ? formatDuration(episode.duration)
                                : "--:--"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">No:</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={7}>
                        <dl className="grid gap-2">
                          <div className="flex items-center justify-center gap-2">
                            <dt>{episodes.length} Tracks</dt>
                            <dd className="flex items-center gap-1 text-muted-foreground">
                              <Clock3 className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                              {formatDuration(totalDuration)}
                            </dd>
                          </div>
                        </dl>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EpisodeForm;
