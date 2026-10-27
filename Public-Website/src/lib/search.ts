/**
 * Shapes shared by the search server action and the search modal. Pure module
 * (no server-only import) so the client can use the types and href builder.
 */
export type SearchHitType =
  | "notice"
  | "event"
  | "teacher"
  | "staff"
  | "alumni"
  | "gallery"
  | "video"
  | "document";

export type SearchHit = {
  id: string;
  type: SearchHitType;
  title: string;
  /** Secondary line — designation, occupation, class label … (CMS text). */
  detail: string;
};

export type SearchContentResult = {
  hits: SearchHit[];
  /** True when the CMS could not be reached for any resource. */
  unavailable: boolean;
};

/** Where a hit opens. Lists without detail pages open their list page. */
export function hitHref(hit: SearchHit): string {
  switch (hit.type) {
    case "notice":
      return `/notices/${hit.id}`;
    case "event":
      return `/events/${hit.id}`;
    case "teacher":
      return "/teachers";
    case "staff":
      return "/staff";
    case "alumni":
      return "/alumni";
    case "gallery":
      return "/gallery";
    case "video":
      return "/videos";
    case "document":
      return "/resources";
  }
}

export const MIN_QUERY_LENGTH = 2;
export const MAX_QUERY_LENGTH = 80;
