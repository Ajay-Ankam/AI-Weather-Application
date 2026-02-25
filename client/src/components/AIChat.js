"use client";
import { useState } from "react";
import api from "@/lib/axios";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your Gemini Weather Assistant. Ask me for a briefing or running tips!",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setInput("");

    try {
      const { data } = await api.post("/ai/chat", { message: input });
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, I'm having trouble connecting to Gemini." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition"
      >
        {isOpen ? "✖" : "💬 AI Assistant"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]">
          <div className="bg-blue-600 p-4 text-white font-bold">
            WeatherAI Gemini Agent
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-400 animate-pulse">
                Gemini is thinking...
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="p-3 border-t bg-white flex gap-2"
          >
            <input
              className="flex-1 text-sm outline-none"
              placeholder="Ask about your cities..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="text-blue-600 font-bold">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
