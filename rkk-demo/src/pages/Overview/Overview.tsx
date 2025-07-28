import React from "react";
import { Kanban } from "react-kanban-kit";

const mockData = {
  root: {
    id: "root",
    title: "Root",
    children: ["col-1", "col-2", "col-3"],
    totalChildrenCount: 3,
    parentId: null,
  },
  "col-1": {
    id: "col-1",
    title: "To Do",
    children: ["task-1", "task-2"],
    totalChildrenCount: 2,
    parentId: "root",
  },
  "col-2": {
    id: "col-2",
    title: "In Progress",
    children: ["task-3"],
    totalChildrenCount: 1,
    parentId: "root",
  },
  "col-3": {
    id: "col-3",
    title: "Done",
    children: ["task-4"],
    totalChildrenCount: 1,
    parentId: "root",
  },
  "task-1": {
    id: "task-1",
    title: "Design Homepage",
    parentId: "col-1",
    children: [],
    totalChildrenCount: 0,
    type: "card",
    content: {
      description: "Create wireframes and mockups for the homepage",
      priority: "high",
    },
  },
  "task-2": {
    id: "task-2",
    title: "Setup Database",
    parentId: "col-1",
    children: [],
    totalChildrenCount: 0,
    type: "card",
  },
  "task-3": {
    id: "task-3",
    title: "Develop API",
    parentId: "col-2",
    children: [],
    totalChildrenCount: 0,
    type: "card",
  },
  "task-4": {
    id: "task-4",
    title: "Deploy to Production",
    parentId: "col-3",
    children: [],
    totalChildrenCount: 0,
    type: "card",
  },
};

export const Overview: React.FC = () => {
  return (
    <div className="rkk-demo-page">
      <div className="rkk-demo-page-header">
        <h1>Basic Kanban Board</h1>
        <p>A simple example showcasing the core features of React Kanban Kit</p>
      </div>

      <div className="rkk-demo-page-content">
        <Kanban
          dataSource={mockData}
          configMap={{
            card: {
              render: ({ data }) => (
                <div className="rkk-demo-card">
                  <h4 className="rkk-demo-card-title">{data.title}</h4>
                  {data.content?.description && (
                    <p className="rkk-demo-card-description">
                      {data.content.description}
                    </p>
                  )}
                  {data.content?.priority && (
                    <span
                      className={`rkk-demo-card-priority priority-${data.content.priority}`}
                    >
                      {data.content.priority}
                    </span>
                  )}
                </div>
              ),
              isDraggable: true,
            },
          }}
          onCardMove={(move) => {
            console.log("Card moved:", move);
          }}
          onColumnMove={(move) => {
            console.log("Column moved:", move);
          }}
        />
      </div>
    </div>
  );
};

export default Overview;
