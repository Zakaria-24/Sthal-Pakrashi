import { notFound } from "next/navigation";

import { isResourceSlug } from "@/lib/resource-config";
import { ResourceManager } from "@/components/resource-manager";

/**
 * One page serves every content type. `settings` has its own route, and Next
 * resolves that static segment ahead of this dynamic one.
 */
export default async function ResourcePage(
  props: PageProps<"/dashboard/[resource]">,
) {
  const { resource } = await props.params;
  if (!isResourceSlug(resource)) notFound();

  return <ResourceManager slug={resource} />;
}
