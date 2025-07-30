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
              href="https://github.com/braiekhazem/react-kanban-kit/?tab=readme-ov-file#react-kanban-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rkk-demo-sidebar-nav-item"
            >
              Documentation
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
