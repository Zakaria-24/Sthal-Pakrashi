/**
 * The slice of site settings the header and mobile drawer need, already
 * resolved for the visitor's locale on the server so the client bundle stays
 * small and free of settings/fallback logic.
 */
export type SiteChrome = {
  logoUrl: string;
  address: string;
  eiin: string;
  /** Localized establishment year, for the brand sub-line. */
  year: string;
  /** Whether the CMS is accepting online applications (drives the Apply CTA). */
  admissionOpen: boolean;
  facebookUrl?: string;
  youtubeUrl?: string;
};
