"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

const routes = [
  {
    href: "/",
    labelKey: "navigation.overview",
    color: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
        <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7" />
        <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity=".7" />
      </svg>
    ),
  },
  {
    href: "/trello",
    labelKey: "navigation.trelloStyle",
    color: "#0ea5e9",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
        <rect x="2" y="2" width="5" height="14" rx="1.5" fill="currentColor" />
        <rect x="9" y="2" width="5" height="9" rx="1.5" fill="currentColor" opacity=".7" />
      </svg>
    ),
  },
  {
    href: "/clickup",
    labelKey: "navigation.clickupStyle",
    color: "#7c3aed",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
        <path d="M3 9.5L7 5.5L9 8L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="11" width="14" height="5" rx="1.5" fill="currentColor" opacity=".4" />
      </svg>
    ),
  },
  {
    href: "/jira",
    labelKey: "navigation.jiraStyle",
    color: "#3b82f6",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
        <path d="M9 2L13.5 6.5L9 9L13.5 11.5L9 16L4.5 11.5L9 9L4.5 6.5L9 2Z" fill="currentColor" opacity=".7" />
        <circle cx="9" cy="9" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/infinite-scroll",
    labelKey: "navigation.infiniteScroll",
    color: "#10b981",
    icon: (
      <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
        <path d="M2 6H16M2 9H12M2 12H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 10L16 12L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeRoute: string;
}

export default function Sidebar({ collapsed, onToggle, activeRoute }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">RK</div>
        <div className="sidebar-logo-text">
          React Kanban
          <small>v0.0.2-beta.6</small>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">{t("navigation.boardExamples")}</div>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`nav-item${activeRoute === route.href ? " active" : ""}`}
          >
            <span className="nav-icon">{route.icon}</span>
            <span className="nav-label">{t(route.labelKey)}</span>
            <span className="nav-color-dot" style={{ background: route.color }} />
          </Link>
        ))}

        <div className="nav-section-label" style={{ marginTop: 12 }}>{t("navigation.documentation")}</div>
        <a
          href="https://github.com/braiekhazem/react-kanban-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
        >
          <span className="nav-icon">
            <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 1.5a7.5 7.5 0 00-2.37 14.63c.375.069.512-.163.512-.361 0-.178-.006-.648-.01-1.273-2.087.453-2.528-.997-2.528-.997-.34-.865-.831-1.095-.831-1.095-.68-.464.052-.455.052-.455.75.053 1.145.772 1.145.772.667 1.14 1.75.812 2.177.62.067-.482.26-.812.473-.998-1.665-.19-3.415-.833-3.415-3.705 0-.819.292-1.488.772-2.013-.077-.19-.335-.953.073-1.987 0 0 .63-.201 2.063.77a7.166 7.166 0 011.875-.252c.637.003 1.278.086 1.875.252 1.43-.97 2.06-.77 2.06-.77.41 1.034.152 1.797.075 1.987.48.525.771 1.194.771 2.013 0 2.88-1.753 3.513-3.422 3.699.27.232.51.69.51 1.39 0 1.003-.01 1.812-.01 2.059 0 .2.135.434.516.36A7.502 7.502 0 009 1.5z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="nav-label">GitHub</span>
        </a>
        <a
          href="https://www.npmjs.com/package/react-kanban-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-item"
        >
          <span className="nav-icon">
            <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
              <rect x="1.5" y="4.5" width="15" height="9" rx="1.5" fill="currentColor" opacity=".25" />
              <path d="M4 7.5v3h2.5v-1.5h1V10.5H9V7.5H4zM10 7.5v3h1.5v-1.5h1v1.5H14V7.5H10z" fill="currentColor" />
            </svg>
          </span>
          <span className="nav-label">NPM</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-toggle-btn" onClick={onToggle}>
          <span className="nav-icon toggle-icon">
            <svg viewBox="0 0 18 18" fill="none" width="16" height="16">
              <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="nav-label">Collapse</span>
        </button>
      </div>
    </aside>
  );
}
