// app/page.tsx (client component)
"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function NormalChat() {
    const [output, setOutput] = useState("");

    async function sendMessage() {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Hello! Explain me what is react" }),
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const lines = decoder.decode(value).split("\n");
            for (const line of lines) {
                if (line.startsWith("data: ") && line !== "data: [DONE]") {
                    const json = JSON.parse(line.replace("data: ", ""));
                    const content = json.choices?.[0]?.delta?.content;
                    if (content) setOutput((prev) => prev + content);
                }
            }
        }
    }

    return (
        <div>
            <button onClick={sendMessage}>Send</button>
            <ReactMarkdown >
                {output}
            </ReactMarkdown>
        </div>
    );
}