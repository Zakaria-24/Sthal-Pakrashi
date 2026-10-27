import { redirect } from "next/navigation";

import { connectDB } from "@/lib/db";
import { Settings } from "@/models/Settings";
import { getCurrentUser } from "@/lib/current-user";
import { env } from "@/lib/env";
import { getPreset, presetToCss } from "@/lib/theme-presets";
import { DashboardShell } from "@/components/dashboard-shell";
import { Toaster } from "@/components/ui/sonner";

/**
 * Renders the saved focus colour before the page paints, so there's no flash
 * of the default indigo before a client script catches up. Any failure here
 * (DB unreachable, no Settings doc yet) falls through to the hardcoded BRAND
 * block in globals.css — this must never be the reason the dashboard 500s.
 */
async function loadChrome(): Promise<{ themeCss: string | null; siteName: string }> {
  try {
    await connectDB();
    const settings = await Settings.findOne(
      { key: "site" },
      { themeColor: 1, primaryColor: 1, siteName: 1 },
    ).lean();

    const siteName = settings?.siteName?.trim() || "School CMS";
    if (settings?.primaryColor) {
      return { themeCss: `:root{--brand:${settings.primaryColor};}`, siteName };
    }
    if (settings?.themeColor) {
      return { themeCss: presetToCss(getPreset(settings.themeColor)), siteName };
    }
    return { themeCss: null, siteName };
  } catch {
    return { themeCss: null, siteName: "School CMS" };
  }
}

/** The public website is the first allowed CORS origin. */
function publicSiteUrl(): string | undefined {
  try {
    return env.ALLOWED_ORIGINS[0];
  } catch {
    return undefined;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /*
   * `proxy.ts` already turned away anyone without a session cookie. This
   * re-checks against the database so a deleted, deactivated, or demoted
   * account loses access at once rather than when its token expires.
   */
  const user = await getCurrentUser();
  // Via /logout rather than /login: the cookie is still signature-valid, so
  // the proxy would send it straight back here. /logout drops it first.
  if (!user) redirect("/logout");

  const { themeCss, siteName } = await loadChrome();

  return (
    <>
      {/*
        Same id the client-side theme picker writes to (theme-presets.ts) —
        picking a swatch updates this tag in place instead of racing it.
      */}
      {themeCss && (
        <style id="theme-preset-override" dangerouslySetInnerHTML={{ __html: themeCss }} />
      )}
      <DashboardShell
        adminName={user.name || user.email}
        role={user.role}
        siteName={siteName}
        siteUrl={publicSiteUrl()}
      >
        {children}
      </DashboardShell>
      <Toaster richColors position="top-right" />
    </>
  );
}
