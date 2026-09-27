import openClient from "@/lib/open-router";

const MODEL = "nvidia/nemotron-3-ultra-550b-a55b:free";

const SYSTEM_PROMPT =
  "You are a helpful, concise AI assistant in a chat app. Keep replies conversational and to the point.";

export async function POST(request) {
  const { messages } = await request.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages is required" }, { status: 400 });
  }

  const chatMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  let completion;

  try {
    completion = await openClient.chat.completions.create(
      {
        model: MODEL,
        messages: chatMessages,
        stream: true,
      },
      { signal: request.signal }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: error?.message || "Failed to start the model response." },
      { status: 500 }
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        for await (const chunk of completion) {
          if (request.signal.aborted) break;
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error(error);
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}