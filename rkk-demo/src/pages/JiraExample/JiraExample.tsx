import React from "react";

export const JiraExample: React.FC = () => {
  return (
    <div className="rkk-demo-page">
      <div className="rkk-demo-page-header">
        <h1>Jira Style Board</h1>
        <p>
          A Jira-inspired Kanban board with enterprise features and agile
          workflow
        </p>
      </div>

      <div className="rkk-demo-page-content">
        <div className="rkk-demo-placeholder">
          <div className="rkk-demo-placeholder-icon">🎫</div>
          <h3>Jira Example Coming Soon</h3>
          <p>
            This page will showcase a Jira-inspired implementation of React
            Kanban Kit featuring:
          </p>
          <ul>
            <li>Jira's blue color scheme and professional layout</li>
            <li>Issue types (Story, Bug, Task, Epic)</li>
            <li>Sprint planning and backlog management</li>
            <li>Story points and estimation</li>
            <li>Epic relationships and hierarchy</li>
            <li>Workflow transitions and statuses</li>
            <li>Reporter and assignee management</li>
          </ul>
          <div className="rkk-demo-placeholder-note">
            The implementation will be added by the developer.
          </div>
        </div>
      </div>
    </div>
  );
};

export default JiraExample;
