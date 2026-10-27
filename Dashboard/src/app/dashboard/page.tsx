import Link from "next/link";

import { connectDB } from "@/lib/db";
import { RESOURCES, RESOURCE_SLUGS, type ResourceSlug } from "@/lib/resource-config";
import { RESOURCE_MODELS } from "@/lib/resource-models";
import { getCurrentUser } from "@/lib/current-user";
import { PageHeader, PageShell } from "@/components/page-header";
import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  FolderOpenIcon,
  ResourceIcon,
  SparklesIcon,
} from "@/components/icons";

type Counts = {
  slug: ResourceSlug;
  label: string;
  count: number | null;
  demo: number;
};

const GROUPS = ["Content", "Institution", "People"] as const;

async function getCounts(): Promise<{ counts: Counts[]; dbError: string | null }> {
  try {
    await connectDB();
    const counts = await Promise.all(
      RESOURCE_SLUGS.map(async (slug) => {
        const [count, demo] = await Promise.all([
          RESOURCE_MODELS[slug].countDocuments({}),
          RESOURCE_MODELS[slug].countDocuments({ isDemo: true }),
        ]);
        return { slug, label: RESOURCES[slug].label, count, demo };
      }),
    );
    return { counts, dbError: null };
  } catch (error) {
    return {
      counts: RESOURCE_SLUGS.map((slug) => ({
        slug,
        label: RESOURCES[slug].label,
        count: null,
        demo: 0,
      })),
      dbError: error instanceof Error ? error.message : "Database unavailable",
    };
  }
}

export default async function DashboardOverview() {
  const [{ counts, dbError }, user] = await Promise.all([
    getCounts(),
    getCurrentUser(),
  ]);

  const total = counts.reduce((sum, entry) => sum + (entry.count ?? 0), 0);
  const demoTotal = counts.reduce((sum, entry) => sum + entry.demo, 0);
  const filled = counts.filter((entry) => (entry.count ?? 0) > 0).length;
  const empty = dbError ? [] : counts.filter((entry) => entry.count === 0);
  const firstName = user?.name?.trim().split(/\s+/)[0];

  const summary = [
    { label: "Published records", value: dbError ? "—" : total },
    { label: "Content types filled", value: dbError ? "—" : `${filled}/${counts.length}` },
    { label: "Demo records", value: dbError ? "—" : demoTotal },
  ];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Dashboard"
        title={firstName ? `Welcome back, ${firstName}` : "Overview"}
        description="Everything published on the school website is managed from here."
      />

      {dbError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">
            Cannot reach the database
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{dbError}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Start it with <code className="font-mono">npm run dev:db</code>, or
            check <code className="font-mono">MONGODB_URI</code> in{" "}
            <code className="font-mono">.env.local</code>.
          </p>
        </div>
      )}

      <section className="relative isolate overflow-hidden rounded-2xl bg-brand px-5 py-6 text-brand-foreground shadow-lift sm:px-8 sm:py-7">
        <span
          aria-hidden
          className="absolute -top-16 -right-12 -z-10 size-56 rounded-full bg-gold opacity-15"
        />
        <span
          aria-hidden
          className="absolute -bottom-20 left-1/3 -z-10 size-40 rounded-full bg-white opacity-5"
        />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-eyebrow tracking-eyebrow text-gold uppercase">
              <SparklesIcon className="size-3.5" />
              Website content at a glance
            </p>
            <p className="mt-2 font-heading text-h2">
              Keep notices, events and people up to date.
            </p>
            {demoTotal > 0 && (
              <p className="mt-2 text-sm text-on-brand-muted">
                {`${demoTotal} demo records`} are filling empty sections. Replace
                them with the institution&apos;s real information when it is ready.
              </p>
            )}
          </div>
          <dl className="grid grid-cols-3 gap-3 sm:gap-4">
            {summary.map((item) => (
              <div
                key={item.label}
                className="flex flex-col-reverse rounded-xl bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:min-w-32 sm:px-4"
              >
                <dt className="text-xs text-on-brand-muted">{item.label}</dt>
                <dd className="font-heading text-stat text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {empty.length > 0 && (
        <section className="rounded-xl border border-gold/60 bg-warning-subtle p-4 sm:p-5">
          <p className="flex items-center gap-2 font-heading text-h3 text-on-gold">
            <FolderOpenIcon className="size-4.5" />
            Sections still empty on the website
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {empty.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/dashboard/${entry.slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-gold-dark/40 bg-white px-3 py-1 text-xs font-semibold text-on-gold transition-colors hover:border-gold-dark hover:bg-gold-tint"
                >
                  {entry.label}
                  <ChevronRightIcon className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {GROUPS.map((group) => {
        const entries = counts.filter((entry) => RESOURCES[entry.slug].group === group);
        if (entries.length === 0) return null;
        return (
          <section key={group} className="space-y-3">
            <h2 className="flex items-center gap-2 text-eyebrow tracking-eyebrow text-muted-foreground uppercase">
              {group}
              <span className="h-px flex-1 bg-border" />
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {entries.map((entry) => {
                return (
                  <li key={entry.slug}>
                    <Link
                      href={`/dashboard/${entry.slug}`}
                      className="group flex h-full items-center gap-4 rounded-xl border bg-card p-4 shadow-card transition-[border-color,box-shadow,transform] duration-200 outline-none hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-subtle text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                        <ResourceIcon slug={entry.slug} className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-muted-foreground">
                          {entry.label}
                        </span>
                        <span className="mt-0.5 flex items-center gap-2">
                          <span className="font-heading text-stat text-foreground">
                            {entry.count ?? "—"}
                          </span>
                          {entry.count === 0 && (
                            <span className="rounded-full bg-gold-tint px-2 py-0.5 text-xs font-semibold text-on-gold">
                              Empty
                            </span>
                          )}
                          {entry.demo > 0 && (
                            <span className="rounded-full border border-dashed border-gold-dark px-2 py-0.5 text-xs font-semibold text-on-gold">
                              {entry.demo === entry.count ? "Demo" : `${entry.demo} demo`}
                            </span>
                          )}
                        </span>
                      </span>
                      <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </PageShell>
  );
}
