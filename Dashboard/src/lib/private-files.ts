import "server-only";

import { v2 as cloudinary } from "cloudinary";

import { env } from "@/lib/env";

/**
 * Storage for applicants' documents. They are personal records, so unlike the
 * public photo uploads they are stored as *private* Cloudinary assets: there is
 * no public URL at all. The dashboard gets a short-lived signed download link
 * on demand, and only for signed-in administrators.
 *
 * Everything lives under `<CLOUDINARY_FOLDER>/applications/`, i.e. inside this
 * school's own namespace (`sthal-pakrashi/…`).
 */
export const APPLICATION_DOC_TTL_SECONDS = 10 * 60;

function configure() {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type StoredFile = {
  publicId: string;
  resourceType: string;
  format: string;
};

export function applicationsFolder(applicationId: string): string {
  return `${env.CLOUDINARY_FOLDER}/applications/${applicationId}`;
}

export async function storePrivateFile(
  buffer: Buffer,
  applicationId: string,
  slot: number,
): Promise<StoredFile> {
  configure();
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: applicationsFolder(applicationId),
          public_id: `document-${slot}`,
          type: "private",
          resource_type: "auto",
          overwrite: false,
        },
        (error, uploaded) => {
          if (error || !uploaded) {
            reject(error ?? new Error("Upload failed"));
            return;
          }
          resolve({
            publicId: uploaded.public_id,
            resourceType: uploaded.resource_type,
            format: uploaded.format ?? "",
          });
        },
      )
      .end(buffer);
  });
}

/** Short-lived download link for one stored document. */
export function signedDownloadUrl(file: StoredFile): string {
  configure();
  return cloudinary.utils.private_download_url(file.publicId, file.format, {
    resource_type: file.resourceType,
    type: "private",
    expires_at: Math.floor(Date.now() / 1000) + APPLICATION_DOC_TTL_SECONDS,
  });
}

/** Best-effort removal; never throws (used on cleanup paths). */
export async function removePrivateFile(file: StoredFile): Promise<void> {
  try {
    configure();
    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: file.resourceType,
      type: "private",
      invalidate: true,
    });
  } catch (error) {
    console.error("[applications] could not remove stored file:", error);
  }
}
