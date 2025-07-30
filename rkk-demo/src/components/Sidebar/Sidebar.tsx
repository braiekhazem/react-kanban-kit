import React from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "../Navigation";

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <aside className="rkk-demo-sidebar">
      <div className="rkk-demo-sidebar-content">
        <div className="rkk-demo-sidebar-section">
          <h3 className="rkk-demo-sidebar-title">
            {t("navigation.boardExamples")}
          </h3>
          <Navigation />
        </div>

        <div className="rkk-demo-sidebar-section">
          <h3 className="rkk-demo-sidebar-title">
            {t("navigation.documentation")}
          </h3>
          <nav className="rkk-demo-sidebar-nav">
            <a
              href="https://github.com/braiekhazem/react-kanban-kit/?tab=readme-ov-file#react-kanban-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rkk-demo-sidebar-nav-item"
            >
              {t("navigation.documentation")}
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
