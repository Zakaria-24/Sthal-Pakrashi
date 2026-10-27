"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { SidebarBrand, SidebarNav } from "@/components/sidebar-nav";
import { cn } from "@/lib/utils";

/**
 * Responsive frame around every dashboard page. From 1024px the sidebar is a
 * sticky full-height column; below that a brand top bar opens the same
 * sidebar as an off-canvas drawer, which closes on navigation or Escape.
 */
export function DashboardShell({
  adminName,
  role,
  siteName,
  siteUrl,
  children,
}: {
  adminName: string;
  role: string;
  siteName: string;
  siteUrl?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Route changes close the drawer (adjust state during render — no effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const nav = (
    <SidebarNav
      adminName={adminName}
      role={role}
      siteName={siteName}
      siteUrl={siteUrl}
    />
  );

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
        {nav}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-sidebar px-4 py-3 shadow-card lg:hidden">
          <SidebarBrand siteName={siteName} />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="dashboard-drawer"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-white transition-colors outline-none hover:bg-sidebar-accent/80 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <Menu className="size-5" />
          </button>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/50 backdrop-blur-[2px] transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          id="dashboard-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard menu"
          inert={!open}
          className={cn(
            "absolute inset-y-0 left-0 w-[min(18rem,85vw)] transition-[transform,visibility] duration-300 ease-out",
            open ? "visible translate-x-0 shadow-lift" : "invisible -translate-x-full",
          )}
        >
          {nav}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="absolute top-4 right-3 flex size-9 items-center justify-center rounded-full bg-sidebar-accent text-white outline-none hover:bg-sidebar-accent/80 focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <X className="size-4" />
          </button>
        </aside>
      </div>
    </div>
  );
}
