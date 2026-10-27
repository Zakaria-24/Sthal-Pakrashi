import type { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { env } from "@/lib/env";
import { fail, handleError, ok, preflight } from "@/lib/api-response";

/**
 * Image uploads go straight to Cloudinary; only the resulting URL is stored on
 * the content document. Cloudinary is optional — if its credentials are absent
 * the dashboard's image fields still accept a pasted URL.
 */

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export async function OPTIONS(request: NextRequest) {
  return preflight(request.headers.get("origin"));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");

  try {
    if (!env.hasCloudinary) {
      return fail(
        "Uploads are not configured. Add CLOUDINARY_* values to .env.local, or paste an image URL instead.",
        501,
        origin,
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return fail("No file provided", 400, origin);
    }
    if (file.size > MAX_BYTES) {
      return fail("File is larger than 5MB", 413, origin);
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return fail(`Unsupported file type "${file.type}"`, 415, origin);
    }

    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: env.CLOUDINARY_FOLDER, resource_type: "auto" },
            (error, uploaded) => {
              if (error || !uploaded) {
                reject(error ?? new Error("Upload failed"));
                return;
              }
              resolve({
                secure_url: uploaded.secure_url,
                public_id: uploaded.public_id,
              });
            },
          )
          .end(buffer);
      },
    );

    return ok({ url: result.secure_url, publicId: result.public_id }, origin);
  } catch (error) {
    return handleError(error, origin);
  }
}
