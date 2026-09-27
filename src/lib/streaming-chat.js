/**
 * Reads a token stream from /api/streaming-chat and forwards each chunk to
 * onChunk as it arrives. Swap the endpoint's implementation for a real model
 * later — this contract (POST -> readable text stream) stays the same.
 */
export async function streamChatReply({ messages, signal, onChunk }) {
  const res = await fetch("/api/streaming-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to start the streaming response.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    onChunk(decoder.decode(value, { stream: true }));
  }
}
