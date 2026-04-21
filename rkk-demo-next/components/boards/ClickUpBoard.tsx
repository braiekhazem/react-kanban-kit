"use client";

import { useState } from "react";
import {
  Kanban,
  type BoardItem,
  type BoardData,
  dropHandler,
} from "react-kanban-kit";
import { mockData } from "@/lib/mock-data";
import {
  getPriorityColor,
  addCard,
  addCardPlaceholder,
  getAddCardPlaceholderKey,
  removeCardPlaceholder,
  toggleCollapsedColumn,
} from "@/lib/kanban-utils";
import { Calendar, User, Flag, ChevronLeft, Plus } from "lucide-react";

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
        style={{ backgroundColor: column?.content?.color as string }}
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

const ClickUpCardAdder = ({
  columnId,
  dataSource,
  setDataSource,
  inTop,
}: {
  columnId: string;
  dataSource: BoardData;
  setDataSource: (d: BoardData) => void;
  inTop: boolean;
}) => {
  const [newCardTitle, setNewCardTitle] = useState("");

  const removeCardPlaceholderHandler = (colId: string) => {
    setDataSource(removeCardPlaceholder(colId, dataSource));
  };

  const addCardHandler = (colId: string, title: string) => {
    if (!title.trim()) return;
    setDataSource(addCard(colId, dataSource, title, inTop));
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
            if (e.key === "Enter") addCardHandler(columnId, newCardTitle);
            else if (e.key === "Escape") removeCardPlaceholderHandler(columnId);
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
  const priorityColor = getPriorityColor(data.content?.priority as string);

  return (
    <div className="clickup-card">
      <div className="clickup-card-content">
        <div className="clickup-card-title">{data.title}</div>
        <div className="clickup-card-footer">
          <div className="clickup-card-icons">
            <div className="clickup-card-icon">
              <User size={16} />
            </div>
            <div className="clickup-card-icon">
              <Calendar size={16} />
            </div>
            <div className="clickup-card-icon priority-flag">
              <Flag size={16} fill={priorityColor} color={priorityColor} />
              <span>{data.content?.priority as string}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ClickUpBoard() {
  const [dataSource, setDataSource] = useState<BoardData>(
    structuredClone(mockData) as BoardData,
  );

  const addCardPlaceholderHandler = (columnId: string, inTop = true) => {
    setDataSource(addCardPlaceholder(columnId, dataSource, inTop));
  };

  const toggleCollapsedColumnHandler = (columnId: string) => {
    setDataSource(toggleCollapsedColumn(columnId, dataSource));
  };

  return (
    <div className="clickup-example board-area">
      <Kanban
        dataSource={dataSource as BoardData}
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
                inTop={data?.content?.inTop as boolean}
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
              undefined,
              (newColumn) => ({
                ...newColumn,
                totalItemsCount: (newColumn.totalItemsCount || 0) + 1,
                totalChildrenCount: (newColumn.totalChildrenCount || 0) + 1,
              }),
              (sourceColumn) => ({
                ...sourceColumn,
                totalItemsCount: (sourceColumn.totalItemsCount || 0) - 1,
                totalChildrenCount: (sourceColumn.totalChildrenCount || 0) - 1,
              }),
            ),
          );
        }}
        columnStyle={(column) => ({
          background: `color-mix(in srgb, ${
            column?.content?.color as string
          }, transparent 92%)`,
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
        allowListFooter={(column) =>
          !column.children.includes(getAddCardPlaceholderKey(column.id))
        }
        onColumnClick={(_, column) => {
          if (column?.content?.isExpanded)
            toggleCollapsedColumnHandler(column.id);
        }}
        columnWrapperClassName={(column) =>
          column?.content?.isExpanded ? "expanded" : ""
        }
      />
    </div>
  );
}
