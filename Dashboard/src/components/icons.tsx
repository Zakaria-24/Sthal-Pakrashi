"use client";

/**
 * lucide-react icons read a React context, so server components cannot render
 * them directly. Server pages import their icons from here instead.
 */
import {
  ArrowUpRight,
  ChevronRight,
  FolderOpen,
  Sparkles,
  type LucideProps,
} from "lucide-react";

import type { ResourceSlug } from "@/lib/resource-config";
import { RESOURCE_ICONS } from "@/lib/resource-icons";

export function ResourceIcon({ slug, ...props }: LucideProps & { slug: ResourceSlug }) {
  const Icon = RESOURCE_ICONS[slug];
  return <Icon {...props} />;
}

export function ArrowUpRightIcon(props: LucideProps) {
  return <ArrowUpRight {...props} />;
}

export function ChevronRightIcon(props: LucideProps) {
  return <ChevronRight {...props} />;
}

export function FolderOpenIcon(props: LucideProps) {
  return <FolderOpen {...props} />;
}

export function SparklesIcon(props: LucideProps) {
  return <Sparkles {...props} />;
}
