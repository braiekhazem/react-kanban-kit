"use client";

import { useState } from "react";
import { Kanban, dropHandler, type BoardData, type BoardItem } from "react-kanban-kit";
import { mockData } from "@/lib/mock-data";

const colColors: Record<string, string> = {
  "col-1": "#8b5cf6",
  "col-2": "#3b82f6",
  "col-3": "#f59e0b",
  "col-4": "#22c55e",
};

function PriorityPill({ priority }: { priority: string }) {
  const cls = ["urgent", "high", "medium", "low"].includes(priority) ? priority : "medium";
  return <span className={`p-pill ${cls}`}>{priority}</span>;
}

function OvCard({ data }: { data: BoardItem }) {
  const initials = (data.content?.assignee || "?")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="ov-card">
      <div className="ov-card-title">{data.title}</div>
      <div className="ov-card-meta">
        <div className="ov-card-user">
          <div className="ov-card-avatar">{initials}</div>
          <span>{(data.content?.assignee as string)?.split(" ")[0] ?? "—"}</span>
        </div>
        <PriorityPill priority={data.content?.priority ?? "medium"} />
      </div>
    </div>
  );
}

export default function OverviewBoard() {
  const [dataSource, setDataSource] = useState<BoardData>(
    structuredClone(mockData) as BoardData
  );

  return (
    <div className="board-area">
      <Kanban
        dataSource={dataSource}
        configMap={{
          card: {
            render: ({ data }) => <OvCard data={data} />,
            isDraggable: true,
          },
        }}
        renderColumnHeader={(column) => (
          <div className="ov-col-header">
            <span
              className="ov-col-dot"
              style={{ background: colColors[column.id] ?? "#8b5cf6" }}
            />
            <span className="ov-col-name">{column.title}</span>
            <span className="ov-col-cnt">{column.totalItemsCount ?? 0}</span>
          </div>
        )}
        columnClassName={() => "ov-column"}
        cardsGap={6}
        virtualization={false}
        onCardMove={(move) =>
          setDataSource(
            dropHandler(
              move, dataSource, undefined,
              (col) => ({ ...col, totalItemsCount: (col.totalItemsCount ?? 0) + 1, totalChildrenCount: (col.totalChildrenCount ?? 0) + 1 }),
              (col) => ({ ...col, totalItemsCount: (col.totalItemsCount ?? 0) - 1, totalChildrenCount: (col.totalChildrenCount ?? 0) - 1 }),
            )
          )
        }
      />
    </div>
  );
}
