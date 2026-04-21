"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Kanban, dropHandler, type BoardData, type BoardItem } from "react-kanban-kit";
import { fetchMoreCards, getInfiniteScrollInitialData } from "@/lib/mock-data";

function ISCard({ data }: { data: BoardItem }) {
  const { category, categoryColor, assignee, avatarColor } = data.content ?? {};

  return (
    <div
      className="is-card"
      style={{ "--is-accent": categoryColor as string } as React.CSSProperties}
    >
      <p className="is-card-title">{data.title}</p>
      <div className="is-card-foot">
        <span
          className="is-badge"
          style={{
            color: categoryColor as string,
            background: `${categoryColor as string}18`,
          }}
        >
          {category as string}
        </span>
        <span
          className="is-assignee"
          style={{ background: avatarColor as string }}
          title={assignee as string}
        >
          {assignee as string}
        </span>
      </div>
    </div>
  );
}

function ISColHeader({ column }: { column: BoardItem }) {
  const loaded = column.children.length;
  const total = column.totalChildrenCount;
  const pct = Math.round((loaded / total) * 100);
  const color = column.content?.color as string ?? "#6366f1";

  return (
    <div className="is-col-head">
      <span className="is-col-dot" style={{ background: color }} />
      <span className="is-col-name">{column.title}</span>
      <span className="is-col-prog">
        <strong>{loaded}</strong>/{total}
        &nbsp;
        <span style={{ color, fontSize: 9, fontFamily: "var(--font-mono)" }}>
          {pct}%
        </span>
      </span>
    </div>
  );
}

export default function InfiniteScrollBoard() {
  const [dataSource, setDataSource] = useState<BoardData>(
    () => getInfiniteScrollInitialData() as BoardData
  );

  const loadingCols = useRef<Set<string>>(new Set());
  const pageRef = useRef<Record<string, number>>({});
  const dsRef = useRef(dataSource);

  useEffect(() => { dsRef.current = dataSource; }, [dataSource]);

  const loadMore = useCallback((columnId: string) => {
    if (loadingCols.current.has(columnId)) return;
    const col = dsRef.current[columnId];
    if (!col || col.children.length >= col.totalChildrenCount) return;

    loadingCols.current.add(columnId);
    const page = pageRef.current[columnId] ?? 1;

    fetchMoreCards(columnId, page).then((items) => {
      pageRef.current[columnId] = page + 1;
      loadingCols.current.delete(columnId);
      setDataSource((prev) => {
        const prevCol = prev[columnId];
        const updated: BoardData = {
          ...prev,
          [columnId]: { ...prevCol, children: [...prevCol.children, ...items.map((i) => i.id)] },
        };
        items.forEach((item) => { updated[item.id] = item as unknown as BoardItem; });
        return updated;
      });
    });
  }, []);

  return (
    <div className="board-area">
      <Kanban
        dataSource={dataSource}
        configMap={{
          card: { render: ({ data }) => <ISCard data={data} />, isDraggable: true },
        }}
        renderColumnHeader={(column) => <ISColHeader column={column} />}
        columnClassName={() => "is-col"}
        cardsGap={6}
        virtualization={true}
        loadMore={loadMore}
        onCardMove={(move) =>
          setDataSource(dropHandler(move, dataSource, undefined))
        }
      />
    </div>
  );
}
