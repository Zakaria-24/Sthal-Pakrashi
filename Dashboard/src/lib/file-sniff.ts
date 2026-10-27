/**
 * Application documents are accepted by *content*, not by the client-declared
 * MIME type: a renamed executable must not get through as "photo.jpg".
 */
export type SniffedType = { mimeType: string; extension: string };

export function sniffDocument(bytes: Uint8Array): SniffedType | null {
  const startsWith = (...signature: number[]) =>
    signature.every((byte, index) => bytes[index] === byte);

  if (startsWith(0x25, 0x50, 0x44, 0x46)) {
    return { mimeType: "application/pdf", extension: "pdf" };
  }
  if (startsWith(0xff, 0xd8, 0xff)) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }
  if (startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) {
    return { mimeType: "image/png", extension: "png" };
  }
  // WEBP: "RIFF" .... "WEBP"
  if (
    startsWith(0x52, 0x49, 0x46, 0x46) &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { mimeType: "image/webp", extension: "webp" };
  }
  return null;
}
