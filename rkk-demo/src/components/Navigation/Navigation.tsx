import React from "react";
import { NavLink } from "react-router-dom";
import { Kanban, Layers, GitBranch } from "lucide-react";

const navigationItems = [
  {
    path: "/",
    label: "Overview",
    icon: Kanban,
    description: "Basic Kanban example",
  },
  {
    path: "/trello",
    label: "Trello Style",
    icon: Layers,
    description: "Trello-inspired board design",
  },
  {
    path: "/clickup",
    label: "ClickUp Style",
    icon: GitBranch,
    description: "ClickUp-inspired board design",
  },
  {
    path: "/jira",
    label: "Jira Style",
    icon: Kanban,
    description: "Jira-inspired board design",
  },
];

export const Navigation: React.FC = () => {
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
              <div className="rkk-demo-navigation-item-label">{item.label}</div>
              <div className="rkk-demo-navigation-item-description">
                {item.description}
              </div>
            </div>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navigation;
