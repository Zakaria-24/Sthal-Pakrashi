import Link from "next/link";

import { connectDB } from "@/lib/db";
import { RESOURCES, RESOURCE_SLUGS } from "@/lib/resource-config";
import { RESOURCE_MODELS } from "@/lib/resource-models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Counts = { slug: string; label: string; count: number | null };

async function getCounts(): Promise<{ counts: Counts[]; dbError: string | null }> {
  try {
    await connectDB();
    const counts = await Promise.all(
      RESOURCE_SLUGS.map(async (slug) => ({
        slug,
        label: RESOURCES[slug].label,
        count: await RESOURCE_MODELS[slug].countDocuments({}),
      })),
    );
    return { counts, dbError: null };
  } catch (error) {
    return {
      counts: RESOURCE_SLUGS.map((slug) => ({
        slug,
        label: RESOURCES[slug].label,
        count: null,
      })),
      dbError: error instanceof Error ? error.message : "Database unavailable",
    };
  }
}

export default async function DashboardOverview() {
  const { counts, dbError } = await getCounts();

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-h1 text-foreground">Overview</h1>
        <p className="text-muted-foreground text-sm">
          Everything published on the school website is managed from here.
        </p>
      </header>

      {dbError && (
        <div className="border-destructive/40 bg-destructive/5 rounded-md border p-4">
          <p className="text-destructive text-sm font-medium">
            Cannot reach the database
          </p>
          <p className="text-muted-foreground mt-1 text-xs">{dbError}</p>
          <p className="text-muted-foreground mt-2 text-xs">
            Start it with <code className="font-mono">npm run dev:db</code>, or
            check <code className="font-mono">MONGODB_URI</code> in{" "}
            <code className="font-mono">.env.local</code>.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {counts.map((entry) => (
          <Link key={entry.slug} href={`/dashboard/${entry.slug}`}>
            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-muted-foreground text-sm font-medium">
                  {entry.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">
                  {entry.count ?? "—"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
