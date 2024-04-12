// models/Podcast.ts
import  { Schema, Document, model, models } from "mongoose";

interface Episode {
  name: string;
  audio: string;
}

export enum PodcastType {
  EPISODIC = "episodic",
  SERIALIZED = "serialized",
}

export enum PodcastStatus {
  PUBLISHED = "published",
  DRAFT = "draft",
  TAKEN_DOWN = "taken down",
}

export interface PodcastDocument extends Document {
  title: string;
  artwork: string;
  artist: string;
  description: string;
  channel?: string;
  type: PodcastType;
  updateFrequency?: string;
  category: string;
  language: string;
  websiteUrl?: string;
  status: PodcastStatus;
  episodes: Episode[];
}

export enum MediaType {
    IMAGE= "image",
    AUDIO= "audio",
    VIDEO= "video",
    FILE = "file",
}



const mediaResourceSchema = new Schema({
    public_id : { type: String },
    secure_url : { type: String },
    type: {
        type: String,
        required: true,
        enum: Object.values(MediaType),
        default: MediaType.IMAGE
    },
});

const episodeSchema = new Schema({
  name: { type: String },
  description: { type: String },
  audio: [mediaResourceSchema],
});

const podcastSchema = new Schema({
  title: { type: String, required: true },
  artwork: [mediaResourceSchema],
  artist: { type: String, required: true },
  description: { type: String, required: true },
  channel: { type: String },
  type: { type: String, enum: Object.values(PodcastType), required: true },
  updateFrequency: { type: String },
  category: { type: String, required: true },
  language: { type: String, required: true },
  websiteUrl: { type: String },
  status: { 
    type: String, 
    enum: Object.values(PodcastStatus), 
    required: true,
    default: PodcastStatus.DRAFT,
 },
  episodes: [episodeSchema],
});
const Podcast = models.podcasts || model("podcasts", podcastSchema);

export default Podcast;
