import openClient from "@/lib/open-router";

// Free-tier models often ignore "valid JSON only" and emit raw control
// characters (literal newlines/tabs) inside string values, which
// JSON.parse rejects. Escape control chars found strictly inside string
// literals — structural whitespace outside strings is left untouched.
function repairJsonControlChars(str) {
  let out = "";
  let inString = false;
  let escaped = false;

  for (const ch of str) {
    if (inString) {
      if (escaped) {
        out += ch;
        escaped = false;
      } else if (ch === "\\") {
        out += ch;
        escaped = true;
      } else if (ch === '"') {
        inString = false;
        out += ch;
      } else if (ch === "\n") {
        out += "\\n";
      } else if (ch === "\r") {
        out += "\\r";
      } else if (ch === "\t") {
        out += "\\t";
      } else {
        out += ch;
      }
    } else if (ch === '"') {
      inString = true;
      out += ch;
    } else {
      out += ch;
    }
  }

  return out;
}

function parseReviewJson(content) {
  let text = content.trim();

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) text = fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }

  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(repairJsonControlChars(text));
  }
}

export async function POST(request) {
  try {
    const { code, language } = await request.json();

    if (!code?.trim()) {
      return Response.json({ error: "Code is required" }, { status: 400 });
    }

    const prompt = `
      You are a senior software engineer performing a thorough code review.

      Language: ${language || "unknown"}

      Code:
      ${code}

      Review the code for bugs, security issues, performance problems,
      readability, and best practices.

      Return ONLY valid JSON in this exact shape:
      {
        "score": 0,
        "summary": "",
        "issues": [
          {
            "severity": "critical" | "warning" | "suggestion" | "praise",
            "line": null,
            "title": "",
            "description": "",
            "suggestion": ""
          }
        ]
      }

      "score" is an overall code quality score from 0 to 100.
      "line" is the relevant line number if applicable, otherwise null.
      Keep "title" short. Order issues from most to least severe.
    `;

    const response = await openClient.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content:
            "You are a precise, constructive code review assistant. Always return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0].message.content;

    let review;

    try {
      review = parseReviewJson(content);
    } catch {
      return Response.json(
        {
          error: "Model returned invalid JSON.",
          raw: content,
        },
        { status: 500 }
      );
    }

    return Response.json({
      score: Number.isFinite(review.score) ? review.score : 0,
      summary: review.summary || "",
      issues: Array.isArray(review.issues) ? review.issues : [],
      language,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to review code." },
      { status: 500 }
    );
  }
}
