import React from "react";
import { Link } from "react-router-dom";
import { Settings, Github, ExternalLink } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="rkk-demo-header">
      <div className="rkk-demo-header-content">
        <div className="rkk-demo-header-left">
          <Link to="/" className="rkk-demo-header-logo">
            <div className="rkk-demo-logo">
              <div className="rkk-demo-logo-icon">RKK</div>
              <div className="rkk-demo-logo-text">
                <span className="rkk-demo-logo-title">React Kanban Kit</span>
                <span className="rkk-demo-logo-subtitle">Demo Showcase</span>
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
              <span>GitHub</span>
            </a>

            <a
              href="https://www.npmjs.com/package/react-kanban-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="rkk-demo-header-nav-item"
              title="View on NPM"
            >
              <ExternalLink size={20} />
              <span>NPM</span>
            </a>

            <button className="rkk-demo-header-nav-item" title="Settings">
              <Settings size={20} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
