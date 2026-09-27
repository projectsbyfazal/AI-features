"use client";

import { useRef, useState } from "react";
import ChatMessageList from "@/components/streaming-chat/ChatMessageList";
import ChatComposer from "@/components/streaming-chat/ChatComposer";
import { streamChatReply } from "@/lib/streaming-chat";

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function StreamingChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef(null);

  function updateMessage(id, updater) {
    setMessages((prev) => prev.map((m) => (m.id === id ? updater(m) : m)));
  }

  async function runAssistantReply(history) {
    const assistantId = createId();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "", status: "streaming" }]);
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      await streamChatReply({
        messages: history,
        signal: controller.signal,
        onChunk: (chunk) => {
          updateMessage(assistantId, (m) => ({ ...m, content: m.content + chunk }));
        },
      });
      updateMessage(assistantId, (m) => ({ ...m, status: "done" }));
    } catch (err) {
      if (err.name === "AbortError") {
        updateMessage(assistantId, (m) => ({ ...m, status: "stopped" }));
      } else {
        updateMessage(assistantId, (m) => ({
          ...m,
          status: "error",
          error: err.message || "Something went wrong generating this reply.",
        }));
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMessage = { id: createId(), role: "user", content: text, status: "done" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    await runAssistantReply([...messages, userMessage]);
  }

  async function handlePrompt(promptText) {
    if (isStreaming) return;
    const userMessage = { id: createId(), role: "user", content: promptText, status: "done" };
    setMessages((prev) => [...prev, userMessage]);
    await runAssistantReply([...messages, userMessage]);
  }

  async function handleRetry(assistantId) {
    if (isStreaming) return;
    const index = messages.findIndex((m) => m.id === assistantId);
    if (index === -1) return;

    const history = messages.slice(0, index);
    setMessages(history);
    await runAssistantReply(history);
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  return (
    <div className="flex h-full flex-col">
      <ChatMessageList messages={messages} onPrompt={handlePrompt} onRetry={handleRetry} />

      <div className="border-t border-zinc-200 bg-white/80 px-4 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <ChatComposer
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isStreaming={isStreaming}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  );
}
