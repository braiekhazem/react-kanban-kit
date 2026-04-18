"use client";

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const routeKeys: Record<string, { titleKey: string; section: string }> = {
  "/": { titleKey: "navigation.overview", section: "Demos" },
  "/trello": { titleKey: "navigation.trelloStyle", section: "Demos" },
  "/clickup": { titleKey: "navigation.clickupStyle", section: "Demos" },
  "/jira": { titleKey: "navigation.jiraStyle", section: "Demos" },
  "/infinite-scroll": {
    titleKey: "navigation.infiniteScroll",
    section: "Demos",
  },
};

interface AppHeaderProps {
  activeRoute: string;
}

export default function AppHeader({ activeRoute }: AppHeaderProps) {
  const { t } = useTranslation();
  const meta = routeKeys[activeRoute] ?? {
    titleKey: "navigation.overview",
    section: "RKK",
  };

  return (
    <header className="app-header">
      <div className="header-crumb">
        <span>react-kanban-kit</span>
        <span className="header-crumb-sep">/</span>
        <span style={{ color: "var(--text-secondary)" }}>{meta.section}</span>
        <span className="header-crumb-sep">/</span>
        <span className="header-crumb-current">{t(meta.titleKey)}</span>
      </div>

      <div className="header-spacer" />

      <a
        href="https://github.com/braiekhazem/react-kanban-kit"
        target="_blank"
        rel="noopener noreferrer"
        className="header-icon-btn"
        title="GitHub"
      >
        <svg viewBox="0 0 16 16" fill="none" width="15" height="15">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1a7 7 0 00-2.213 13.656c.35.064.478-.152.478-.337 0-.166-.006-.605-.01-1.188-1.948.423-2.359-.93-2.359-.93-.318-.808-.776-1.022-.776-1.022-.635-.434.048-.425.048-.425.702.049 1.07.72 1.07.72.623 1.065 1.634.758 2.032.58.063-.45.243-.758.441-.932-1.555-.177-3.189-.778-3.189-3.458 0-.765.273-1.39.72-1.88-.072-.177-.313-.89.069-1.854 0 0 .588-.188 1.926.72a6.71 6.71 0 011.751-.235c.595.003 1.194.08 1.751.235 1.335-.908 1.922-.72 1.922-.72.383.964.142 1.677.07 1.854.448.49.719 1.115.719 1.88 0 2.687-1.637 3.279-3.197 3.452.252.217.477.645.477 1.3 0 .937-.01 1.692-.01 1.922 0 .187.126.405.482.337A7.001 7.001 0 008 1z"
            fill="currentColor"
          />
        </svg>
      </a>

      <LanguageSwitcher />
    </header>
  );
}
