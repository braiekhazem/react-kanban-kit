import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n"; // Initialize i18n
import "./main.scss";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
