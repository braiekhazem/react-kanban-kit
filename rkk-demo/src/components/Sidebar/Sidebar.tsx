import React from "react";
import { Navigation } from "../Navigation";

export const Sidebar: React.FC = () => {
  return (
    <aside className="rkk-demo-sidebar">
      <div className="rkk-demo-sidebar-content">
        <div className="rkk-demo-sidebar-section">
          <h3 className="rkk-demo-sidebar-title">Board Examples</h3>
          <Navigation />
        </div>

        <div className="rkk-demo-sidebar-section">
          <h3 className="rkk-demo-sidebar-title">Documentation</h3>
          <nav className="rkk-demo-sidebar-nav">
            <a
              href="https://github.com/your-username/react-kanban-kit#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="rkk-demo-sidebar-nav-item"
            >
              Getting Started
            </a>
            <a
              href="https://github.com/your-username/react-kanban-kit#props"
              target="_blank"
              rel="noopener noreferrer"
              className="rkk-demo-sidebar-nav-item"
            >
              API Reference
            </a>
            <a
              href="https://github.com/your-username/react-kanban-kit#examples"
              target="_blank"
              rel="noopener noreferrer"
              className="rkk-demo-sidebar-nav-item"
            >
              Examples
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
