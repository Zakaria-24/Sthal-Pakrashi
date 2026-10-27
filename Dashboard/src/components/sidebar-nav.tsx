"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { RESOURCES, RESOURCE_SLUGS } from "@/lib/resource-config";
import { api } from "@/lib/client-api";
import {
  ROLE_LABELS,
  canEditSettings,
  canManageUsers,
} from "@/lib/permissions";
import type { UserRole } from "@/models/User";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * The navigation is generated from the resource registry, so a new content
 * type appears here automatically. Entries the current role cannot use are
 * hidden — `proxy.ts` is what actually enforces this.
 */
const GROUPS = ["Content", "Institution", "People"] as const;

export function SidebarNav({
  adminName,
  role,
}: {
  adminName: string;
  role: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await api.logout();
    router.replace("/login");
    router.refresh();
  }

  function linkClass(href: string) {
    const active = pathname === href;
    return cn(
      "block rounded-md px-3 py-2 text-sm transition-colors",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
    );
  }

  return (
    <aside className="bg-sidebar border-sidebar-border flex w-60 shrink-0 flex-col border-r">
      <div className="border-sidebar-border border-b px-4 py-4">
        <Link href="/dashboard" className="block">
          <span className="text-sidebar-foreground text-sm font-semibold">
            School CMS
          </span>
          <span className="text-sidebar-foreground/60 block text-xs">
            Content dashboard
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Overview
          </Link>
        </div>

        {GROUPS.map((group) => {
          const slugs = RESOURCE_SLUGS.filter(
            (slug) => RESOURCES[slug].group === group,
          );
          if (slugs.length === 0) return null;

          return (
            <div key={group} className="space-y-1">
              <p className="text-sidebar-foreground/50 px-3 pb-1 text-xs font-medium tracking-wide uppercase">
                {group}
              </p>
              {slugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/dashboard/${slug}`}
                  className={linkClass(`/dashboard/${slug}`)}
                >
                  {RESOURCES[slug].label}
                </Link>
              ))}
            </div>
          );
        })}

        {canEditSettings(role) && (
          <div className="space-y-1">
            <p className="text-sidebar-foreground/50 px-3 pb-1 text-xs font-medium tracking-wide uppercase">
              Admission
            </p>
            <Link
              href="/dashboard/admission"
              className={linkClass("/dashboard/admission")}
            >
              Admission info
            </Link>
            <Link
              href="/dashboard/applications"
              className={linkClass("/dashboard/applications")}
            >
              Applications
            </Link>
          </div>
        )}

        {(canEditSettings(role) || canManageUsers(role)) && (
          <div className="space-y-1">
            <p className="text-sidebar-foreground/50 px-3 pb-1 text-xs font-medium tracking-wide uppercase">
              Configuration
            </p>
            {canEditSettings(role) && (
              <Link
                href="/dashboard/settings"
                className={linkClass("/dashboard/settings")}
              >
                Site settings
              </Link>
            )}
            {canManageUsers(role) && (
              <Link
                href="/dashboard/users"
                className={linkClass("/dashboard/users")}
              >
                Users
              </Link>
            )}
          </div>
        )}
      </nav>

      <div className="border-sidebar-border space-y-2 border-t px-4 py-3">
        <p className="text-sidebar-foreground/70 truncate text-xs">
          {adminName}
        </p>
        <p className="text-sidebar-foreground/50 truncate text-xs">
          {ROLE_LABELS[role as UserRole] ?? role}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleLogout}
        >
          Sign out
        </Button>
      </div>
    </aside>
  );
}
