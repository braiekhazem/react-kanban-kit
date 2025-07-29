import React, { useState } from "react";
import {
  Kanban,
  type BoardItem,
  type BoardData,
  dropHandler,
} from "react-kanban-kit";
import { mockData } from "../../utils/_mock_";
import { Calendar, User, Flag, ChevronLeft, Plus } from "lucide-react";
import {
  getPriorityColor,
  addCard,
  addCardPlaceholder,
  getAddCardPlaceholderKey,
  removeCardPlaceholder,
  toggleCollapsedColumn,
} from "../../utils/kanbanUtils";

const ClickUpColumnHeader = ({
  column,
  toggleCollapsedColumnHandler,
  addCardPlaceholderHandler,
}: {
  column: BoardItem;
  toggleCollapsedColumnHandler: (columnId: string) => void;
  addCardPlaceholderHandler: (columnId: string, inTop: boolean) => void;
}) => {
  const isExpanded = column?.content?.isExpanded;

  return (
    <div className={`clickup-column-header ${isExpanded ? "expanded" : ""}`}>
      <div
        className="clickup-column-header-left"
        style={{ backgroundColor: column?.content?.color }}
      >
        <span />
        <span>{column.title}</span>
      </div>
      <p className="clickup-column-header-count">{column.totalItemsCount}</p>
      {!isExpanded && (
        <div className="clickup-column-header-right">
          <span onClick={() => toggleCollapsedColumnHandler(column.id)}>
            <ChevronLeft size={14} />
          </span>
          <span onClick={() => addCardPlaceholderHandler(column.id, true)}>
            <Plus size={14} />
          </span>
        </div>
      )}
    </div>
  );
};

const ClickUpCardAdder: React.FC<{
  columnId: string;
  dataSource: BoardData;
  setDataSource: (dataSource: BoardData) => void;
  inTop: boolean;
}> = ({ columnId, dataSource, setDataSource, inTop }) => {
  const [newCardTitle, setNewCardTitle] = useState("");

  const removeCardPlaceholderHandler = (columnId: string) => {
    setDataSource(removeCardPlaceholder(columnId, dataSource));
  };

  const addCardHandler = (columnId: string, title: string) => {
    if (!title.trim()) return;
    setDataSource(addCard(columnId, dataSource, title, inTop));
  };

  return (
    <div
      className="clickup-example-new-card"
      onBlur={() => {
        if (newCardTitle.trim()) addCardHandler(columnId, newCardTitle);
        else removeCardPlaceholderHandler(columnId);
      }}
      tabIndex={0}
    >
      <div className="clickup-example-new-card-header">
        <input
          type="text"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
          placeholder="Task name"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addCardHandler(columnId, newCardTitle);
            } else if (e.key === "Escape") {
              removeCardPlaceholderHandler(columnId);
            }
          }}
        />
        <button
          className="clickup-save-btn"
          onClick={() => addCardHandler(columnId, newCardTitle)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

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
  const [dataSource, setDataSource] = useState<BoardData>(
    mockData as BoardData
  );

  const addCardPlaceholderHandler = (
    columnId: string,
    inTop: boolean = true
  ) => {
    setDataSource(addCardPlaceholder(columnId, dataSource, inTop));
  };

  const toggleCollapsedColumnHandler = (columnId: string) => {
    console.log("toggleCollapsedColumnHandler", columnId);
    setDataSource(toggleCollapsedColumn(columnId, dataSource));
  };

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
          dataSource={dataSource as any}
          configMap={{
            card: {
              render: ({ data }) => <ClickUpCard data={data} />,
              isDraggable: true,
            },
            "new-card": {
              render: ({ column, data }) => (
                <ClickUpCardAdder
                  columnId={column.id}
                  dataSource={dataSource}
                  setDataSource={setDataSource}
                  inTop={data?.content?.inTop}
                />
              ),
              isDraggable: false,
            },
          }}
          columnClassName={() => "clickup-column"}
          renderColumnHeader={(column) => (
            <ClickUpColumnHeader
              column={column}
              toggleCollapsedColumnHandler={toggleCollapsedColumnHandler}
              addCardPlaceholderHandler={addCardPlaceholderHandler}
            />
          )}
          cardsGap={4}
          virtualization={true}
          onCardMove={(move) => {
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
            );
          }}
          columnListContentClassName={() => "clickup-column-list-content"}
          columnStyle={(column) => ({
            background: `color-mix(in srgb, ${column?.content?.color}, transparent 92%)`,
          })}
          renderListFooter={(column) => (
            <div
              className="clickup-list-footer"
              onClick={() => addCardPlaceholderHandler(column.id, false)}
            >
              <span>
                <Plus size={14} color="#838383" />
              </span>
              <p>Add Task</p>
            </div>
          )}
          allowListFooter={(column) => {
            return !column.children.includes(
              getAddCardPlaceholderKey(column.id)
            );
          }}
          onColumnClick={(_, column) => {
            console.log("onColumnClick", column);
            if (column?.content?.isExpanded)
              toggleCollapsedColumnHandler(column.id);
          }}
          columnWrapperClassName={"expanded"}
        />
      </div>
    </div>
  );
};

export default ClickUpExample;
