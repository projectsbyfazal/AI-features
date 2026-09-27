import Link from "next/link";
import { navItems } from "@/lib/nav-items";
import NavIcon from "@/components/layout/NavIcon";
import { getAccent } from "@/lib/accent-colors";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8 lg:py-14">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome to AI Feature Lab
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
          A growing collection of AI-powered tools. Pick a feature from the
          sidebar, or jump in below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {navItems.map((item) => {
          const accent = getAccent(item.color);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 ${accent.ring}`}
            >
              <span className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`} />
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.icon}`}>
                <NavIcon name={item.icon} className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.label}
                </h2>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
              <span className={`mt-auto flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 ${accent.text}`}>
                Open
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
