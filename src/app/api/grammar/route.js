import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request) {
  try {
    const { text, tone } = await request.json();

    if (!text?.trim()) {
      return Response.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const prompt = `
      You are an English Grammar Expert.
      Correct only the grammar.
      Keep the original meaning.
      Do not explain anything.\
      Do not add extra sentences.
      Return only the corrected text.

      Tone: ${tone || "Neutral"}
      Text: ${text}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    return Response.json({
      correctedText: response.text.trim(),
      tone,
      changes: [],
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: error?.message || error?.status || "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}