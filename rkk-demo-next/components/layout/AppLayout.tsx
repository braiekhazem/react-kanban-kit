"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";

const routeMeta: Record<string, { titleKey: string; descKey: string }> = {
  "/": { titleKey: "pages.overview.title", descKey: "pages.overview.description" },
  "/trello": { titleKey: "pages.trello.title", descKey: "pages.trello.description" },
  "/clickup": { titleKey: "pages.clickup.title", descKey: "pages.clickup.description" },
  "/jira": { titleKey: "pages.jira.title", descKey: "pages.jira.description" },
  "/infinite-scroll": { titleKey: "pages.infiniteScroll.title", descKey: "pages.infiniteScroll.description" },
};

interface AppLayoutProps {
  children: React.ReactNode;
  activeRoute?: string;
  actions?: React.ReactNode;
}

export default function AppLayout({
  children,
  activeRoute = "/",
  actions,
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useTranslation();
  const meta = routeMeta[activeRoute];

  return (
    <div className="app-root">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((p) => !p)}
        activeRoute={activeRoute}
      />
      <div className="main-pane">
        <AppHeader activeRoute={activeRoute} />
        <div className="page-shell">
          {meta && (
            <div className="page-head">
              <div>
                <h1 className="page-title">{t(meta.titleKey)}</h1>
                <p className="page-desc">{t(meta.descKey)}</p>
              </div>
              {actions && <div className="page-actions">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
