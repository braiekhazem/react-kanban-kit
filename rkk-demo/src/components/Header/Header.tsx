import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Settings, Github, ExternalLink } from "lucide-react";
import { LanguageSwitcher } from "../LanguageSwitcher";

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header className="rkk-demo-header">
      <div className="rkk-demo-header-content">
        <div className="rkk-demo-header-left">
          <Link to="/" className="rkk-demo-header-logo">
            <div className="rkk-demo-logo">
              <div className="rkk-demo-logo-icon">RKK</div>
              <div className="rkk-demo-logo-text">
                <span className="rkk-demo-logo-title">{t("header.title")}</span>
                <span className="rkk-demo-logo-subtitle">
                  {t("header.subtitle")}
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="rkk-demo-header-right">
          <nav className="rkk-demo-header-nav">
            <a
              href="https://github.com/your-username/react-kanban-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rkk-demo-header-nav-item"
              title="View on GitHub"
            >
              <Github size={20} />
              <span>{t("header.github")}</span>
            </a>

            <a
              href="https://www.npmjs.com/package/react-kanban-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rkk-demo-header-nav-item"
              title="View on NPM"
            >
              <ExternalLink size={20} />
              <span>{t("header.npm")}</span>
            </a>

            <LanguageSwitcher />

            <button
              className="rkk-demo-header-nav-item"
              title={t("header.settings")}
            >
              <Settings size={20} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
