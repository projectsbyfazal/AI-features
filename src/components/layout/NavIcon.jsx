const paths = {
  spellcheck:
    "M9 4 4 16m0 0 5-12m-5 12h6M15 8l3 3m0 0 3-3m-3 3v9M4 20h4",
  mail: "M3 6h18v12H3V6Zm0 0 9 7 9-7",
  chat: "M4 4h16v11H7l-3 3V4Z",
  bolt: "M13 3 5 14h6l-1 7 8-11h-6l1-7Z",
  code: "m9 6-6 6 6 6m6-12 6 6-6 6",
  doc: "M7 3h7l5 5v13H7V3Zm7 0v5h5",
  image: "M4 4h16v16H4V4Zm3 12 4-5 3 3.5 2.5-3L20 16M8 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",
  home: "M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z",
  grid: "M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z",
};

export default function NavIcon({ name, className = "h-5 w-5" }) {
  const d = paths[name] ?? paths.grid;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
