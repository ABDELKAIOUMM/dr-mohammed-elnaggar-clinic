import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerServiceWorker } from "./register-sw";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Registered from here rather than from markup so it picks up Vite's `base`
// through `import.meta.env.BASE_URL`, and so the dev server is left untouched.
registerServiceWorker();
