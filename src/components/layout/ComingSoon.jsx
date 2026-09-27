import NavIcon from "./NavIcon";

export default function ComingSoon({ icon, title, description }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
        <NavIcon name={icon} className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      <span className="mt-5 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Coming soon
      </span>
    </div>
  );
}
