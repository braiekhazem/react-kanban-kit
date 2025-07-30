import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Kanban, Layers, GitBranch } from "lucide-react";

const navigationItems = [
  {
    path: "/",
    labelKey: "navigation.overview",
    icon: Kanban,
    descriptionKey: "navigation.overviewDescription",
  },
  {
    path: "/trello",
    labelKey: "navigation.trelloStyle",
    icon: Layers,
    descriptionKey: "navigation.trelloDescription",
  },
  {
    path: "/clickup",
    labelKey: "navigation.clickupStyle",
    icon: GitBranch,
    descriptionKey: "navigation.clickupDescription",
  },
  // {
  //   path: "/tam",
  //   labelKey: "navigation.tamStyle",
  //   icon: Kanban,
  //   descriptionKey: "navigation.tamDescription",
  // },
];

export const Navigation: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="rkk-demo-navigation">
      {navigationItems.map((item) => {
        const IconComponent = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `rkk-demo-navigation-item ${isActive ? "active" : ""}`
            }
            end={item.path === "/"}
          >
            <div className="rkk-demo-navigation-item-icon">
              <IconComponent size={20} />
            </div>
            <div className="rkk-demo-navigation-item-content">
              <div className="rkk-demo-navigation-item-label">
                {t(item.labelKey)}
              </div>
              <div className="rkk-demo-navigation-item-description">
                {t(item.descriptionKey)}
              </div>
            </div>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;
