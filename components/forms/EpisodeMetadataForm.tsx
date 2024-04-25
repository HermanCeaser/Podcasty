import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LucideCircleX} from "lucide-react";
import { Textarea } from "../ui/textarea";

const EpisodeMetadataForm = ({
  episodeIdx,
  title,
  handleClose,
  handleSubmit,
}: {
  episodeIdx: number;
  title: string;
  handleClose: () => void;
  updateFields: () => void
}) => {
  return (
    <>
      <div className="flex justify-between">
        <h5>Metadata Editing</h5>
        <Button className="rounded-full" variant="ghost" size="sm" onClick={handleClose} title="Close">
          <LucideCircleX />
        </Button>
      </div>
      <div className="grid items-start gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input type="text" id="title" defaultValue={title} onChange={(e) => {
            updateFields({episodes: [...episodes, episodes.map((episode, idx) => {
              idx === episodeIdx ? {...episode, episode.title: e.target.value } : episode;
            })]})
          }}/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Episode description" required />
        </div>
        <div className="place-self-end">
          <Button onClick={handleClose} type="button" variant="secondary">Finished Editing Metadata</Button>
        </div>
      </div>
    </>
  );
};

export default EpisodeMetadataForm;


// const handleTitleChange = (e) => {
//   updateFields({
//     episodes: [...episodes, 
//       episodes.map((episode, idx) => {
//         idx === episodeIdx ? 
//         {...episode, episode.title: e.target.value } : 
//         episode;
//   })]
// });
// }