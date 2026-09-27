"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav-items";
import { getAccent } from "@/lib/accent-colors";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import NavIcon from "./NavIcon";

export default function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = navItems.find((item) => item.href === pathname);
  const accent = getAccent(current?.color);

  return (
    <div className="flex h-full">
      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50 h-full w-72 bg-white shadow-xl dark:bg-zinc-950">
            <Sidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/80 px-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 lg:px-6">
          <button
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 lg:hidden"
            aria-label="Open navigation"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {current && (
            <span className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:flex ${accent.icon}`}>
              <NavIcon name={current.icon} className="h-4 w-4" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {current?.label ?? "AI Feature Lab"}
            </h1>
            {current?.description && (
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {current.description}
              </p>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto bg-gradient-to-br from-indigo-50/60 via-zinc-50 to-violet-50/40 dark:from-indigo-950/10 dark:via-black dark:to-violet-950/10">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
