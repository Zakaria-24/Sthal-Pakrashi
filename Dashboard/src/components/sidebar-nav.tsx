"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCog,
  type LucideIcon,
} from "lucide-react";

import { RESOURCES, RESOURCE_SLUGS } from "@/lib/resource-config";
import { RESOURCE_ICONS } from "@/lib/resource-icons";
import { api } from "@/lib/client-api";
import {
  ROLE_LABELS,
  canEditSettings,
  canManageUsers,
} from "@/lib/permissions";
import type { UserRole } from "@/models/User";
import { cn } from "@/lib/utils";

/**
 * The navigation is generated from the resource registry, so a new content
 * type appears here automatically. Entries the current role cannot use are
 * hidden — `proxy.ts` is what actually enforces this.
 *
 * Styled after the public site's green brand block: a dark brand panel with a
 * gold marker on the active entry. Used both as the fixed desktop sidebar and
 * inside the mobile drawer (see DashboardShell).
 */
const GROUPS = ["Content", "Institution", "People"] as const;

type NavLink = { href: string; label: string; icon: LucideIcon };

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9 shrink-0", className)}
    >
      <path d="M12 2 22 7v3H2V7Z" className="fill-gold" />
      <path d="M4 11h16v9H4Z" className="fill-white/15" />
      <path d="M4 11h16v9H4Z" className="stroke-white" strokeWidth={1.4} />
      <path d="M9 20v-5h6v5" className="stroke-gold" strokeWidth={1.4} />
    </svg>
  );
}

export function SidebarBrand({ siteName }: { siteName: string }) {
  return (
    <Link
      href="/dashboard"
      className="flex min-w-0 items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
    >
      <BrandMark />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-heading text-sm font-bold text-white">
          {siteName}
        </span>
        <span className="text-eyebrow tracking-eyebrow text-on-brand-muted uppercase">
          Content dashboard
        </span>
      </span>
    </Link>
  );
}

function NavItem({ href, label, icon: Icon, active }: NavLink & { active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        active
          ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1.5 bottom-1.5 left-0 w-1 rounded-r-full bg-sidebar-primary transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        className={cn(
          "size-4 shrink-0",
          active ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-primary",
        )}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <p className="px-3 pb-1.5 text-eyebrow tracking-eyebrow text-on-brand-muted/70 uppercase">
      {children}
    </p>
  );
}

export function SidebarNav({
  adminName,
  role,
  siteName,
  siteUrl,
  className,
}: {
  adminName: string;
  role: string;
  siteName: string;
  siteUrl?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await api.logout();
    router.replace("/login");
    router.refresh();
  }

  function isActive(href: string) {
    return href === "/dashboard"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  const initials =
    adminName
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "A";

  return (
    <div className={cn("flex h-full flex-col bg-sidebar text-sidebar-foreground", className)}>
      <div className="border-b border-sidebar-border px-4 py-4">
        <SidebarBrand siteName={siteName} />
      </div>

      <nav aria-label="Dashboard" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div className="space-y-0.5">
          <NavItem href="/dashboard" label="Overview" icon={LayoutDashboard} active={isActive("/dashboard")} />
        </div>

        {GROUPS.map((group) => {
          const slugs = RESOURCE_SLUGS.filter(
            (slug) => RESOURCES[slug].group === group,
          );
          if (slugs.length === 0) return null;

          return (
            <div key={group} className="space-y-0.5">
              <GroupLabel>{group}</GroupLabel>
              {slugs.map((slug) => (
                <NavItem
                  key={slug}
                  href={`/dashboard/${slug}`}
                  label={RESOURCES[slug].label}
                  icon={RESOURCE_ICONS[slug]}
                  active={isActive(`/dashboard/${slug}`)}
                />
              ))}
            </div>
          );
        })}

        {canEditSettings(role) && (
          <div className="space-y-0.5">
            <GroupLabel>Admission</GroupLabel>
            <NavItem href="/dashboard/admission" label="Admission info" icon={ClipboardList} active={isActive("/dashboard/admission")} />
            <NavItem href="/dashboard/applications" label="Applications" icon={Inbox} active={isActive("/dashboard/applications")} />
          </div>
        )}

        {(canEditSettings(role) || canManageUsers(role)) && (
          <div className="space-y-0.5">
            <GroupLabel>Configuration</GroupLabel>
            {canEditSettings(role) && (
              <NavItem href="/dashboard/settings" label="Site settings" icon={Settings} active={isActive("/dashboard/settings")} />
            )}
            {canManageUsers(role) && (
              <NavItem href="/dashboard/users" label="Users" icon={UserCog} active={isActive("/dashboard/users")} />
            )}
          </div>
        )}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-3">
        {siteUrl && (
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-lg bg-sidebar-primary px-3 py-2 text-sm font-semibold text-sidebar-primary-foreground transition-[filter] outline-none hover:brightness-95 focus-visible:ring-2 focus-visible:ring-white"
          >
            View website
            <ExternalLink className="size-4" />
          </a>
        )}
        <div className="flex items-center gap-2.5 rounded-lg px-1">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent font-heading text-xs font-bold text-sidebar-primary"
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-sidebar-accent-foreground">
              {adminName}
            </p>
            <p className="truncate text-xs text-on-brand-muted">
              {ROLE_LABELS[role as UserRole] ?? role}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/75 transition-colors outline-none hover:bg-sidebar-accent hover:text-white focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
