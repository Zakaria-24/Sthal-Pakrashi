import { redirect } from "next/navigation";

import { connectDB } from "@/lib/db";
import { Settings } from "@/models/Settings";
import { getCurrentUser } from "@/lib/current-user";
import { getPreset, presetToCss } from "@/lib/theme-presets";
import { SidebarNav } from "@/components/sidebar-nav";
import { Toaster } from "@/components/ui/sonner";

/**
 * Renders the saved focus colour before the page paints, so there's no flash
 * of the default indigo before a client script catches up. Any failure here
 * (DB unreachable, no Settings doc yet) falls through to the hardcoded BRAND
 * block in globals.css — this must never be the reason the dashboard 500s.
 */
async function loadThemeCss(): Promise<string | null> {
  try {
    await connectDB();
    const settings = await Settings.findOne(
      { key: "site" },
      { themeColor: 1, primaryColor: 1 },
    ).lean();

    if (settings?.primaryColor) {
      return `:root{--brand:${settings.primaryColor};}`;
    }
    if (settings?.themeColor) {
      return presetToCss(getPreset(settings.themeColor));
    }
    return null;
  } catch {
    return null;
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

  const themeCss = await loadThemeCss();

  return (
    <div className="flex min-h-screen">
      {/*
        Same id the client-side theme picker writes to (theme-presets.ts) —
        picking a swatch updates this tag in place instead of racing it.
      */}
      {themeCss && (
        <style id="theme-preset-override" dangerouslySetInnerHTML={{ __html: themeCss }} />
      )}
      <SidebarNav adminName={user.name || user.email} role={user.role} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
