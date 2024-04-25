import { useEffect, useState, useMemo } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
  Clock3,
  DeleteIcon,
  EditIcon,
  LucideCircleX,
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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "../ui/tooltip";

import { formatDuration } from "@/lib/utils";
import EpisodeMetadataForm from "./EpisodeMetadataForm";
import { Episode } from "../PodcastCreator";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

type EpisodeFormData = {
  episodes: Episode[];
};

type EpisodeFormProps = EpisodeFormData & {
  updateFields: (fields: Partial<EpisodeFormData>) => void;
  onDrop: (acceptedFiles: File[], _fileRejections: FileRejection[]) => void;
};

let a: HTMLAudioElement | null;
const EpisodeForm = ({ episodes, updateFields, onDrop }: EpisodeFormProps) => {
  const [currentOpenDialog, setCurrentOpenDialog] = useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(
    null
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

  const handleEdit = (episodeIndex: number) => {
    setCurrentOpenDialog(episodeIndex);
    // console.log('Edit Clicked!');
  };

  const closeForm = () => {
    setCurrentOpenDialog(null);
  };

  const handleMetadaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number,
    element: keyof Episode
  ) => {
    const newEpisodes = episodes.map((episode, episodeIdx) => {
      if (idx === episodeIdx) {
        return {
          ...episode,
          [element]: e.target.value,
        };
      } else {
        return episode;
      }
    });
    updateFields({
      episodes: newEpisodes,
    });
  };

  // calculate the totalDuration of the episodes
  const totalDuration: number = useMemo(() => {
    return episodes.reduce((total, episode) => {
      return total + Number(episode?.duration);
    }, 0);
  }, [episodes]);

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
                <p className="font-normal text-sm md:px-6">
                  <b className="text-primary-background/60">
                    Drag n drop some files here OR click to select files
                  </b>{" "}
                </p>
              </div>

              <h5 className="mb-2 text-xl font-bold tracking-tight text-primary-background">
                Upload Audio Files
              </h5>
              <p className="font-normal text-sm text-primary-background md:px-6">
                Choosen audio file size should be less than{" "}
                <b className="text-primary-background/60">10 mbs</b>
              </p>
              <p className="font-normal text-sm text-primary-background md:px-6">
                and should be in{" "}
                <b className="text-primary/60">mp3, aac, or wav</b> format.
              </p>
              <span
                id="filename"
                className="text-primary-background/50 bg-primary/10 z-50"
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
                      <TableHead colSpan={2}>MetaData</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {episodes.map((episode, idx) => {
                      if (
                        currentOpenDialog !== null &&
                        currentOpenDialog === idx
                      ) {
                        return (
                          <TableRow key={idx}>
                            <TableCell colSpan={7}>
                              <div>
                                <div className="flex justify-between">
                                  <h5>Metadata Editing</h5>
                                  <Button
                                    className="rounded-full"
                                    variant="ghost"
                                    size="sm"
                                    onClick={closeForm}
                                    title="Close"
                                  >
                                    <LucideCircleX />
                                  </Button>
                                </div>
                                <div className="grid items-start gap-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                      type="text"
                                      id="title"
                                      defaultValue={episode.title}
                                      onChange={(e) => {
                                        handleMetadaChange(e, idx, "title");
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="description">
                                      Description
                                    </Label>
                                    <Textarea
                                      id="description"
                                      defaultValue={episode.description}
                                      placeholder="Episode description"
                                      onChange={(e) => {
                                        handleMetadaChange(
                                          e,
                                          idx,
                                          "description"
                                        );
                                      }}
                                      required
                                    />
                                  </div>
                                  <div className="place-self-end">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      onClick={closeForm}
                                    >
                                      {" "}
                                      Finished Editing Metadata
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      } else {
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
                                      URL.createObjectURL(episode.audio),
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
                            <TableCell>{episode.title}</TableCell>
                            <TableCell colSpan={2}>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-start gap-2">
                                      <dt className="text-muted-foreground">
                                        Duration:{" "}
                                      </dt>
                                      <dd>
                                        {episode.duration
                                          ? formatDuration(episode.duration)
                                          : "--:--"}
                                      </dd>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <dl>
                                      <div className="flex justify-start gap-2">
                                        <dt className="text-muted-foreground">
                                          Audio:{" "}
                                        </dt>
                                        <dd>{episode.audio.name}</dd>
                                      </div>
                                      <div className="flex justify-start gap-2">
                                        <dt className="text-muted-foreground">
                                          Description:{" "}
                                        </dt>
                                        <dd>{episode.description}</dd>
                                      </div>
                                    </dl>
                                    <TooltipArrow className="fill-popover" />
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>

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
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(idx)}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      }
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
