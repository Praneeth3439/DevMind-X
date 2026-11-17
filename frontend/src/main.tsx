import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";

function App() {
  return (
    <main className="shell">
      <p className="eyebrow">Software engineering intelligence</p>
      <h1>DevMind X</h1>
      <p className="intro">
        Connect a repository to investigate defects with evidence, generate repairs,
        and validate proposed changes.
      </p>
      <section className="status-card" aria-label="System status">
        <span className="status-dot" aria-hidden="true" />
        Foundation ready
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

