import React from "react";
import { Kanban, type BoardItem } from "react-kanban-kit";
import { mockData } from "../../utils/_mock_";
import { Calendar, User, Flag, ChevronLeft, Plus } from "lucide-react";
import { getPriorityColor } from "../../utils/kanbanUtils";

const ClickUpCard = ({ data }: { data: BoardItem }) => {
  const priorityColor = getPriorityColor(data.content?.priority);

  return (
    <div className="clickup-card">
      <div className="clickup-card-content">
        {/* Task Title */}
        <div className="clickup-card-title">{data.title}</div>

        {/* Card Footer with Icons */}
        <div className="clickup-card-footer">
          <div className="clickup-card-icons">
            {/* User Icon */}
            <div className="clickup-card-icon">
              <User size={16} />
            </div>

            <div className="clickup-card-icon">
              <Calendar size={16} />
            </div>

            <div className="clickup-card-icon priority-flag">
              <Flag size={16} fill={priorityColor} color={priorityColor} />
              <span>{data.content?.priority}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ClickUpExample: React.FC = () => {
  return (
    <div className="clickup-example">
      <div className="rkk-demo-page-header">
        <h1>ClickUp-Style Kanban Board</h1>
        <p>
          A ClickUp-inspired board with priority indicators and clean card
          design
        </p>
      </div>

      <div className="rkk-demo-page-content">
        <Kanban
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dataSource={mockData as any}
          configMap={{
            card: {
              render: ({ data }) => <ClickUpCard data={data} />,
              isDraggable: true,
            },
          }}
          columnClassName={() => "clickup-column"}
          renderColumnHeader={(column) => (
            <div className="clickup-column-header">
              <div
                className="clickup-column-header-left"
                style={{ backgroundColor: column?.content?.color }}
              >
                <span />
                <span>{column.title}</span>
              </div>
              <div className="clickup-column-header-right">
                <span>
                  <ChevronLeft size={14} />
                </span>
                <span>
                  <Plus size={14} />
                </span>
              </div>
            </div>
          )}
          cardsGap={4}
          virtualization={false}
          onCardMove={(move) => {
            console.log("Card moved:", move);
          }}
          columnStyle={(column) => ({
            background: `color-mix(in srgb, ${column?.content?.color}, transparent 92%)`,
          })}
        />
      </div>
    </div>
  );
};

export default ClickUpExample;
