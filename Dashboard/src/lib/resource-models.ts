import "server-only";

import type { Model } from "mongoose";

import {
  AcademicDocument,
  Alumni,
  Banner,
  ClassInfo,
  CommitteeMember,
  Event,
  Founder,
  GalleryItem,
  LeadershipMessage,
  Notice,
  Post,
  Program,
  Recognition,
  Staff,
  Teacher,
  UniformItem,
  UsefulLink,
  VideoItem,
} from "@/models/content";
import type { ResourceSlug } from "@/lib/resource-config";

/**
 * Server-only half of the resource registry: maps a URL slug to its Mongoose
 * model. Kept separate from `resource-config.ts` so client components can
 * import field definitions without pulling mongoose into the browser bundle.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RESOURCE_MODELS: Record<ResourceSlug, Model<any>> = {
  banners: Banner,
  notices: Notice,
  events: Event,
  gallery: GalleryItem,
  videos: VideoItem,
  uniform: UniformItem,
  links: UsefulLink,
  messages: LeadershipMessage,
  recognitions: Recognition,
  classes: ClassInfo,
  documents: AcademicDocument,
  teachers: Teacher,
  staff: Staff,
  founders: Founder,
  committee: CommitteeMember,
  alumni: Alumni,
  posts: Post,
  programs: Program,
};
