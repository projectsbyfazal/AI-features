// Tailwind v4 scans source for literal class strings, so each accent's
// classes must be spelled out in full here rather than built dynamically
// (e.g. `bg-${color}-50` would not be picked up by the compiler).
export const ACCENT_COLORS = {
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300",
    ring: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
    text: "text-emerald-600 dark:text-emerald-300",
    activeBg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    activeIcon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300",
    bar: "bg-emerald-600 dark:bg-emerald-400",
    dot: "bg-emerald-500",
  },
  sky: {
    icon: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
    ring: "hover:border-sky-300 dark:hover:border-sky-500/40",
    text: "text-sky-600 dark:text-sky-300",
    activeBg: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
    activeIcon: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300",
    bar: "bg-sky-600 dark:bg-sky-400",
    dot: "bg-sky-500",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300",
    ring: "hover:border-violet-300 dark:hover:border-violet-500/40",
    text: "text-violet-600 dark:text-violet-300",
    activeBg: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    activeIcon: "bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300",
    bar: "bg-violet-600 dark:bg-violet-400",
    dot: "bg-violet-500",
  },
  rose: {
    icon: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300",
    ring: "hover:border-rose-300 dark:hover:border-rose-500/40",
    text: "text-rose-600 dark:text-rose-300",
    activeBg: "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    activeIcon: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300",
    bar: "bg-rose-600 dark:bg-rose-400",
    dot: "bg-rose-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300",
    ring: "hover:border-amber-300 dark:hover:border-amber-500/40",
    text: "text-amber-600 dark:text-amber-300",
    activeBg: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    activeIcon: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300",
    bar: "bg-amber-600 dark:bg-amber-400",
    dot: "bg-amber-500",
  },
  cyan: {
    icon: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300",
    ring: "hover:border-cyan-300 dark:hover:border-cyan-500/40",
    text: "text-cyan-600 dark:text-cyan-300",
    activeBg: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300",
    activeIcon: "bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300",
    bar: "bg-cyan-600 dark:bg-cyan-400",
    dot: "bg-cyan-500",
  },
  indigo: {
    icon: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
    ring: "hover:border-indigo-300 dark:hover:border-indigo-500/40",
    text: "text-indigo-600 dark:text-indigo-300",
    activeBg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    activeIcon: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300",
    bar: "bg-indigo-600 dark:bg-indigo-400",
    dot: "bg-indigo-500",
  },
};

export function getAccent(color) {
  return ACCENT_COLORS[color] ?? ACCENT_COLORS.indigo;
}
