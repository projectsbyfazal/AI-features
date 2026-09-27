"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav-items";
import { getAccent } from "@/lib/accent-colors";
import NavIcon from "./NavIcon";

export default function Sidebar({ onNavigate }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-5 py-5"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm shadow-indigo-500/30">
          AI
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI Feature Lab
        </span>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <p className="px-2.5 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Features
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const accent = getAccent(item.color);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm transition-colors ${
                    active
                      ? accent.activeBg
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                  }`}
                >
                  {active && (
                    <span className={`absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full ${accent.bar}`} />
                  )}
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? accent.activeIcon
                        : "bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700"
                    }`}
                  >
                    <NavIcon name={item.icon} className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium leading-tight">
                      {item.label}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-3 mb-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
        <p className="font-medium text-zinc-700 dark:text-zinc-300">
          Crafted with ❤ 
        </p>
        <p className="mt-0.5">By Yasir Fazal Khan.</p>
      </div>
    </div>
  );
}
