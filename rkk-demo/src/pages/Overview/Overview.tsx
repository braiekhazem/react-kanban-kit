import React, { useState } from "react";
import { dropHandler, Kanban, type BoardData } from "react-kanban-kit";
import { User } from "lucide-react";
import { mockData } from "../../utils/_mock_";

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const getColorClass = (priority: string) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  return (
    <span className={`demo-priority-badge ${getColorClass(priority)}`}>
      {priority}
    </span>
  );
};

export const Overview: React.FC = () => {
  const [dataSource, setDataSource] = useState<BoardData>(
    mockData as BoardData
  );

  return (
    <div className="rkk-demo-page">
      <div className="rkk-demo-page-header">
        <h1>Project Management Board</h1>
        <p>
          A comprehensive example showcasing professional task cards with
          realistic project data
        </p>
      </div>

      <div className="rkk-demo-page-content">
        <Kanban
          dataSource={dataSource}
          configMap={{
            card: {
              render: ({ data }) => (
                <div className="demo-task-card">
                  <div className="demo-task-card-header">
                    <h4 className="demo-task-card-title">{data.title}</h4>
                    <PriorityBadge
                      priority={data.content?.priority || "medium"}
                    />
                  </div>

                  <div className="demo-task-card-footer">
                    <div className="demo-task-card-assignee">
                      <User size={14} />
                      <span>{data.content?.assignee || "Unassigned"}</span>
                    </div>
                  </div>
                </div>
              ),
              isDraggable: true,
            },
          }}
          cardsGap={6}
          virtualization={false}
          onCardMove={(move) =>
            setDataSource(
              dropHandler(
                move,
                dataSource,
                () => {},
                (newColumn) => {
                  return {
                    ...newColumn,
                    totalItemsCount: (newColumn.totalItemsCount || 0) + 1,
                    totalChildrenCount: (newColumn.totalChildrenCount || 0) + 1,
                  };
                },
                (sourceColumn) => {
                  return {
                    ...sourceColumn,
                    totalItemsCount: (sourceColumn.totalItemsCount || 0) - 1,
                    totalChildrenCount:
                      (sourceColumn.totalChildrenCount || 0) - 1,
                  };
                }
              )
            )
          }
        />
      </div>
    </div>
  );
};

export default Overview;
