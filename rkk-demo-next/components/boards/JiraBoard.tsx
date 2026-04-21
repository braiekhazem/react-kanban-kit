"use client";

import { useState } from "react";
import { Kanban, dropHandler, type BoardData, type BoardItem } from "react-kanban-kit";
import { getJiraInitialData } from "@/lib/mock-data";

const issueTypeConfig: Record<string, { bg: string; color: string; label: string; icon: React.ReactNode }> = {
  story: {
    bg: "#22c55e18", color: "#22c55e", label: "Story",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
        <circle cx="6" cy="6" r="5" fill="#22c55e" />
        <path d="M4 6.5L5.5 8L8 5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  bug: {
    bg: "#ef444418", color: "#ef4444", label: "Bug",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
        <circle cx="6" cy="6" r="5" fill="#ef4444" />
        <path d="M4.5 4.5L7.5 7.5M7.5 4.5L4.5 7.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  task: {
    bg: "#3b82f618", color: "#3b82f6", label: "Task",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
        <rect x="1.5" y="1.5" width="9" height="9" rx="2" fill="#3b82f6" />
        <path d="M3.5 6L5.5 8L8.5 4.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  epic: {
    bg: "#8b5cf618", color: "#8b5cf6", label: "Epic",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
        <path d="M6 1L8 5H11L8.5 7.5L9.5 11L6 9L2.5 11L3.5 7.5L1 5H4L6 1Z" fill="#8b5cf6" />
      </svg>
    ),
  },
};

const priorityConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  critical: {
    color: "#f43f5e",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
        <path d="M6 2v5M6 9.5v.5" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  high: {
    color: "#f97316",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
        <path d="M6 9V2M3 5l3-3 3 3" stroke="#f97316" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  medium: {
    color: "#f59e0b",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
        <path d="M3 4.5h6M3 7.5h6" stroke="#f59e0b" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  low: {
    color: "#64748b",
    icon: (
      <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
        <path d="M6 3v7M3 7l3 3 3-3" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

function JiraCard({ data }: { data: BoardItem }) {
  const issueType = data.content?.issueType as string ?? "task";
  const priority = data.content?.priority as string ?? "medium";
  const typeConf = issueTypeConfig[issueType] ?? issueTypeConfig.task;
  const prioConf = priorityConfig[priority] ?? priorityConfig.medium;
  const initials = (data.content?.assignee as string) ?? "?";
  const avatarColor = data.content?.avatarColor as string ?? "#3b82f6";

  return (
    <div className="jira-card">
      <div className="jira-card-head">
        <div
          className="jira-type-icon"
          style={{ background: typeConf.bg }}
          title={typeConf.label}
        >
          {typeConf.icon}
        </div>
        <div className="jira-card-title">{data.title}</div>
      </div>
      <div className="jira-card-foot">
        <span className="jira-card-id">{data.content?.issueKey as string}</span>
        <div className="jira-card-meta">
          {prioConf.icon}
          {typeof data.content?.storyPoints === "number" && (
            <span className="jira-sp">{data.content.storyPoints as number} pts</span>
          )}
          <div
            className="jira-avatar"
            style={{ background: avatarColor }}
            title={initials}
          >
            {initials}
          </div>
        </div>
      </div>
    </div>
  );
}

const colColorMap: Record<string, string> = {
  "jira-col-1": "#6b7280",
  "jira-col-2": "#3b82f6",
  "jira-col-3": "#f59e0b",
  "jira-col-4": "#22c55e",
};

export default function JiraBoard() {
  const [dataSource, setDataSource] = useState<BoardData>(
    () => getJiraInitialData() as BoardData
  );

  return (
    <div className="board-area">
      <Kanban
        dataSource={dataSource}
        configMap={{
          card: {
            render: ({ data }) => <JiraCard data={data} />,
            isDraggable: true,
          },
        }}
        columnClassName={() => "jira-col"}
        renderColumnHeader={(column) => (
          <div className="jira-col-head">
            <span
              style={{
                width: 8, height: 8, minWidth: 8,
                borderRadius: "50%",
                background: colColorMap[column.id] ?? "#6b7280",
                display: "inline-block",
              }}
            />
            <span className="jira-col-name">{column.title}</span>
            <span className="jira-col-cnt">{column.totalItemsCount ?? 0}</span>
          </div>
        )}
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
