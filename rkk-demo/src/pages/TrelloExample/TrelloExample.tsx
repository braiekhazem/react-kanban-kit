import React, { useState } from "react";
import { Kanban, type BoardData, dropHandler } from "react-kanban-kit";
import { mockData } from "../../utils/_mock_";
import { Eye } from "lucide-react";
import {
  addCard,
  addCardPlaceholder,
  getAddCardPlaceholderKey,
  removeCardPlaceholder,
} from "../../utils/kanbanUtils";

const TrelloCardAdder: React.FC<{
  columnId: string;
  dataSource: BoardData;
  setDataSource: (dataSource: BoardData) => void;
}> = ({ columnId, dataSource, setDataSource }) => {
  const [newCardTitle, setNewCardTitle] = useState("");

  const removeCardPlaceholderHandler = (columnId: string) => {
    setDataSource(removeCardPlaceholder(columnId, dataSource));
  };

  const addCardHandler = (columnId: string, title: string) => {
    if (!title.trim()) return;
    setDataSource(addCard(columnId, dataSource, title));
  };

  return (
    <div className="trello-example-new-card">
      <input
        type="text"
        onChange={(e) => setNewCardTitle(e.target.value)}
        placeholder="Enter a title for this card..."
      />
      <div className="trello-example-new-card-buttons">
        <button onClick={() => addCardHandler(columnId, newCardTitle)}>
          Add
        </button>
        <button onClick={() => removeCardPlaceholderHandler(columnId)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrelloCard: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="trello-card">
      {/* Cover Image */}
      {data.content?.coverImage && (
        <div className="trello-card-cover">
          <img
            src={data.content.coverImage}
            alt="Card cover"
            draggable={false}
          />
        </div>
      )}

      <div className="trello-card-content">
        {/* Labels */}
        {data.content?.labels && data.content.labels.length > 0 && (
          <div className="trello-card-labels">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.content.labels.map((label: any, index: number) => (
              <span
                key={index}
                className="trello-card-label"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <div className="trello-card-title">{data.title}</div>

        {/* Activity Indicators */}

        {/* Members */}
        {data.content?.members && data.content.members.length > 0 && (
          <div className="trello-card-members">
            {data.content.members
              .slice(0, 4)
              .map((member: string, index: number) => (
                <div key={index} className="trello-card-member">
                  {member
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              ))}
            {data.content.members.length > 4 && (
              <div className="trello-card-member-more">
                +{data.content.members.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const TrelloExample: React.FC = () => {
  const [dataSource, setDataSource] = useState<BoardData>(
    mockData as BoardData
  );
  console.log({ dataSource });
  const addCardPlaceholderHandler = (
    columnId: string,
    inTop: boolean = true
  ) => {
    setDataSource(addCardPlaceholder(columnId, dataSource, inTop));
  };

  return (
    <div className="trello-example">
      <div className="rkk-demo-page-header">
        <h1>Trello-Style Kanban Board</h1>
        <p>
          A Trello-inspired board with labels, cover images, and member avatars
        </p>
      </div>

      <div className="rkk-demo-page-content">
        <Kanban
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dataSource={dataSource as any}
          configMap={{
            card: {
              render: ({ data }) => <TrelloCard data={data} />,
              isDraggable: true,
            },
            "new-card": {
              render: ({ column }) => (
                <TrelloCardAdder
                  columnId={column.id}
                  dataSource={dataSource}
                  setDataSource={setDataSource}
                />
              ),
              isDraggable: false,
            },
          }}
          columnClassName={() => "trello-example-column"}
          renderColumnHeader={(column) => (
            <div className="trello-example-column-header">
              <span>{column.title}</span>
              <div className="trello-example-column-header-count">
                {column.totalItemsCount || 0}
              </div>
              <div className="trello-example-column-header-settings">
                <Eye size={16} />
              </div>
            </div>
          )}
          cardsGap={8}
          virtualization={false}
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
          onColumnMove={(move) => {
            console.log("Column moved:", move);
          }}
          renderListFooter={(column) => {
            return (
              <div
                className="trello-example-list-footer"
                onClick={() => addCardPlaceholderHandler(column.id, false)}
              >
                <div className="trello-example-list-footer-button">
                  + Add card
                </div>
                <div className="trello-example-list-footer-button">
                  <svg
                    width="24"
                    height="24"
                    role="presentation"
                    focusable="false"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 6V5C3 3.89543 3.89543 3 5 3H6C6.55228 3 7 3.44772 7 4C7 4.55228 6.55228 5 6 5H5V6C5 6.55228 4.55228 7 4 7C3.44772 7 3 6.55228 3 6Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6 8C6 6.89543 6.89543 6 8 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H8C6.89543 20 6 19.1046 6 18V8ZM8 8H19V14H8V8ZM18 18C17.4477 18 17 17.5523 17 17C17 16.4477 17.4477 16 18 16C18.5523 16 19 16.4477 19 17C19 17.5523 18.5523 18 18 18ZM8 17C8 17.5523 8.44772 18 9 18H12C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16H9C8.44772 16 8 16.4477 8 17Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M4 14C3.44772 14 3 14.4477 3 15V16C3 17.1046 3.89543 18 5 18V15C5 14.4477 4.55228 14 4 14Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M3 9C3 8.44772 3.44772 8 4 8C4.55228 8 5 8.44772 5 9V12C5 12.5523 4.55228 13 4 13C3.44772 13 3 12.5523 3 12V9Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M8 4C8 3.44772 8.44772 3 9 3H13C13.5523 3 14 3.44772 14 4C14 4.55228 13.5523 5 13 5H9C8.44772 5 8 4.55228 8 4Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M16 3C15.4477 3 15 3.44772 15 4C15 4.55228 15.4477 5 16 5H19C19 3.89543 18.1046 3 17 3H16Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
              </div>
            );
          }}
          allowListFooter={(column) => {
            return !column.children.includes(
              getAddCardPlaceholderKey(column.id)
            );
          }}
        />
      </div>
    </div>
  );
};

export default TrelloExample;
