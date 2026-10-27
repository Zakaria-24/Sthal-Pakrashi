import type { LeadershipMessage } from "@/lib/types";

/**
 * The head teacher / principal as shown on the About and Teachers pages.
 *
 * `null` means the CMS has no real message (only bundled samples), in which
 * case pages show the design's clearly-marked placeholder instead of a sample
 * record posing as a real person.
 */
export type Leader = {
  name: string;
  designation: string;
  photoUrl: string;
  message: string;
  isDemo?: boolean;
};

export function pickLeader(
  messages: LeadershipMessage[],
  isFallback: boolean,
): Leader | null {
  if (isFallback) return null;
  const head =
    messages.find((m) => m.role === "head-teacher") ??
    messages.find((m) => m.role === "assistant-head-teacher") ??
    messages[0];
  if (!head) return null;
  return {
    name: head.name,
    designation: head.designation,
    photoUrl: head.photoUrl,
    message: head.message,
    isDemo: head.isDemo,
  };
}
