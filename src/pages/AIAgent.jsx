import AIWidget from "../components/AIWidget";

export default function AIAgent() {
  return (
    <div className="page-inner">
      <div className="page-header">
        <h1 className="page-title">🤖 AI Agent</h1>
      </div>
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <AIWidget />
      </div>
    </div>
  );
}