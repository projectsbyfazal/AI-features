export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 lg:px-6">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row">
        <p>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            AI Feature Lab
          </span>{" "}
          — a growing collection of AI-powered tools.
        </p>
        <p>
          Crafted with{" "}
          <span className="text-rose-500 dark:text-rose-400">❤</span> by{" "}
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Yasir Fazal Khan
          </span>
        </p>
      </div>
    </footer>
  );
}
