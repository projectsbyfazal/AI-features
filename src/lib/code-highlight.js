const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "for", "while",
  "do", "switch", "case", "break", "continue", "class", "extends", "new",
  "this", "super", "import", "export", "default", "from", "async", "await",
  "try", "catch", "finally", "throw", "typeof", "instanceof", "in", "of",
  "null", "undefined", "true", "false", "void", "yield", "static", "get",
  "set", "delete", "def", "elif", "except", "pass", "lambda", "with", "as",
  "is", "not", "and", "or", "None", "True", "False", "self", "print",
  "public", "private", "protected", "interface", "implements", "package",
  "enum", "struct", "impl", "fn", "mod", "use", "pub", "match", "trait",
]);

const TOKEN_RE =
  /(\/\/.*$)|(#.*$)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(`(?:[^`\\]|\\.)*`)|(\b\d+\.?\d*\b)|(\b[A-Za-z_$][\w$]*\b)|([{}()[\];:,.<>+\-*/%=!&|^~?])/gm;

const CLASS_BY_GROUP = [
  "text-zinc-400 dark:text-zinc-500 italic", // //comment
  "text-zinc-400 dark:text-zinc-500 italic", // #comment
  "text-zinc-400 dark:text-zinc-500 italic", // /* */
  "text-emerald-600 dark:text-emerald-400", // "string"
  "text-emerald-600 dark:text-emerald-400", // 'string'
  "text-emerald-600 dark:text-emerald-400", // `template`
  "text-amber-600 dark:text-amber-400", // number
  null, // identifier/keyword — resolved per-match
  "text-zinc-400 dark:text-zinc-500", // punctuation
];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlightCode(code) {
  let out = "";
  let lastIndex = 0;

  for (const match of code.matchAll(TOKEN_RE)) {
    const [full] = match;
    out += escapeHtml(code.slice(lastIndex, match.index));

    const groupIndex = match.slice(1).findIndex((g) => g !== undefined);
    const escaped = escapeHtml(full);

    if (groupIndex === 7) {
      out += KEYWORDS.has(full)
        ? `<span class="text-indigo-600 dark:text-indigo-400 font-medium">${escaped}</span>`
        : escaped;
    } else {
      const cls = CLASS_BY_GROUP[groupIndex];
      out += cls ? `<span class="${cls}">${escaped}</span>` : escaped;
    }

    lastIndex = match.index + full.length;
  }

  out += escapeHtml(code.slice(lastIndex));
  return out;
}
