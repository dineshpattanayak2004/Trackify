import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { authHeader } from "../utils/auth";
import { API_BASE_URL } from "../config/api";

const suggestions = [
  "How many users are there?",
  "Show my contacts overview",
  "Who joined recently?",
  "Give me a full business overview",
  "Top company in my network",
  "Help me — what can you do?",
];

const robotStyleId = "robot-ai-styles";
if (!document.getElementById(robotStyleId)) {
  const style = document.createElement("style");
  style.id = robotStyleId;
  style.textContent = `
    @keyframes robotBlink {
      0%, 90%, 100% { transform: scaleY(1); }
      95% { transform: scaleY(0.1); }
    }
    @keyframes robotScan {
      0% { transform: translateX(-100%) rotate(-25deg); }
      100% { transform: translateX(400%) rotate(-25deg); }
    }
    @keyframes robotPulse {
      0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.4), 0 0 60px rgba(6,182,212,0.2); }
      50% { box-shadow: 0 0 30px rgba(124,58,237,0.6), 0 0 80px rgba(6,182,212,0.3); }
    }
    @keyframes robotFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes messageSlideIn {
      0% { opacity: 0; transform: translateY(12px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes dotPulse {
      0%, 100% { opacity: 0.3; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    @keyframes earGlow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .robot-thinking-dot:nth-child(1) { animation: dotPulse 1.2s ease-in-out infinite; }
    .robot-thinking-dot:nth-child(2) { animation: dotPulse 1.2s ease-in-out 0.2s infinite; }
    .robot-thinking-dot:nth-child(3) { animation: dotPulse 1.2s ease-in-out 0.4s infinite; }
  `;
  document.head.appendChild(style);
}

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "🤖 Hello! I'm **Trackify AI** — your intelligent business assistant. Ask me anything about your users, contacts, or business data!",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const robotRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMouseMove = useCallback((e) => {
    if (!robotRef.current) return;
    const rect = robotRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / 30;
    const dy = (e.clientY - cy) / 30;
    setEyePos({
      x: Math.max(-6, Math.min(6, dx)),
      y: Math.max(-4, Math.min(4, dy)),
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setIsThinking(true);

    try {
      const resp = await axios.post(
        `${API_BASE_URL}/ai/ask`,
        { question },
        { headers: authHeader() }
      );
      const answer =
        resp.data.answer ||
        resp.data?.choices?.[0]?.message?.content ||
        "No answer";
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "⚠️ Sorry, I couldn't reach my backend. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderText = (text) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} style={{ color: "#7c3aed" }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <section className="ai-widget-card robot-ai-widget">
      {/* Robot Header */}
      <div className="robot-header">
        <div className="robot-avatar-container" ref={robotRef}>
          <div className="robot-head">
            {/* Antenna */}
            <div className="robot-antenna">
              <div className="robot-antenna-tip" />
            </div>
            {/* Ears */}
            <div className="robot-ear robot-ear-left" />
            <div className="robot-ear robot-ear-right" />
            {/* Eyes */}
            <div className="robot-eyes">
              <div className="robot-eye">
                <div
                  className="robot-pupil"
                  style={{
                    transform: `translate(${eyePos.x}px, ${eyePos.y}px)`,
                  }}
                />
              </div>
              <div className="robot-eye">
                <div
                  className="robot-pupil"
                  style={{
                    transform: `translate(${eyePos.x}px, ${eyePos.y}px)`,
                  }}
                />
              </div>
            </div>
            {/* Mouth */}
            <div className="robot-mouth">
              <div className="robot-mouth-grill" />
              <div className="robot-mouth-grill" />
              <div className="robot-mouth-grill" />
            </div>
            {/* Scanning beam */}
            <div className="robot-scan" />
          </div>
          <div className="robot-status">
            <span className="robot-status-dot" />
            <span>{isThinking ? "Processing..." : "Online"}</span>
          </div>
        </div>
        <div className="robot-header-text">
          <p className="eyebrow">AI Business Intelligence</p>
          <h2>Trackify AI Agent</h2>
          <p className="robot-subtitle">
            Powered by real-time database — ask anything about your business
          </p>
        </div>
        <span className={`badge ${isThinking ? "badge-thinking" : ""}`}>
          <span className="badge-dot" />
          {isThinking ? "Thinking" : "Live"}
        </span>
      </div>

      {/* Messages */}
      <div className="ai-messages robot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role} robot-message`}
            style={{ animation: `messageSlideIn 0.35s ease-out` }}
          >
            {msg.role === "assistant" && (
              <div className="robot-message-icon">
                <span>🤖</span>
              </div>
            )}
            <div className={`bubble robot-bubble ${msg.role}`}>
              {renderText(msg.text)}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="message assistant robot-message">
            <div className="robot-message-icon">
              <span>🤖</span>
            </div>
            <div className="bubble robot-bubble assistant robot-thinking">
              <div className="robot-thinking-dot" style={{ animationDelay: "0s" }} />
              <div className="robot-thinking-dot" style={{ animationDelay: "0.15s" }} />
              <div className="robot-thinking-dot" style={{ animationDelay: "0.3s" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="ai-suggestions robot-suggestions">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            className="suggestion robot-suggestion"
            onClick={() => {
              setInput(text);
              inputRef.current?.focus();
            }}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="ai-input-area robot-input-area">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about your business..."
          className="ai-input robot-input"
          disabled={isThinking}
        />
        <button
          type="button"
          className={`ai-send robot-send ${isThinking ? "disabled" : ""}`}
          onClick={sendMessage}
          disabled={isThinking}
        >
          {isThinking ? (
            <span className="robot-send-thinking">...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Ask
            </>
          )}
        </button>
      </div>
    </section>
  );
}