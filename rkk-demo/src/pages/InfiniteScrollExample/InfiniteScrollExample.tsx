import React, { useCallback, useEffect, useRef, useState } from "react";
import { Kanban, type BoardData, dropHandler } from "react-kanban-kit";
import { fetchMoreCards, getInfiniteScrollInitialData } from "../../utils/_mock_";
import type { BoardItem } from "react-kanban-kit";

const InfiniteScrollCard: React.FC<{ data: BoardItem }> = ({ data }) => {
  const { category, categoryColor, assignee, avatarColor } = data.content || {};

  return (
    <div className="is-card" style={{ borderLeftColor: categoryColor }}>
      <p className="is-card-title">{data.title}</p>
      <div className="is-card-footer">
        <span className="is-card-badge" style={{ color: categoryColor, backgroundColor: `${categoryColor}18` }}>
          {category}
        </span>
        <div className="is-card-avatar" style={{ backgroundColor: avatarColor }}>
          {assignee}
        </div>
      </div>
    </div>
  );
};

const InfiniteScrollColumnHeader: React.FC<{ column: BoardItem }> = ({ column }) => {
  const loaded = column.children.length;
  const total = column.totalChildrenCount;

  return (
    <div className="is-column-header">
      <div className="is-column-header-left">
        <span className="is-column-dot" style={{ backgroundColor: column.content?.color }} />
        <span className="is-column-title">{column.title}</span>
      </div>
      <span className="is-column-count">{loaded}/{total}</span>
    </div>
  );
};

export const InfiniteScrollExample: React.FC = () => {
  const [dataSource, setDataSource] = useState<BoardData>(
    () => getInfiniteScrollInitialData() as BoardData
  );

  const loadingColumns = useRef<Set<string>>(new Set());
  const pageRef = useRef<Record<string, number>>({});
  const dataSourceRef = useRef(dataSource);

  useEffect(() => {
    dataSourceRef.current = dataSource;
  }, [dataSource]);

  const loadMore = useCallback((columnId: string) => {
    if (loadingColumns.current.has(columnId)) return;

    const col = dataSourceRef.current[columnId];
    if (!col || col.children.length >= col.totalChildrenCount) return;

    loadingColumns.current.add(columnId);
    const page = pageRef.current[columnId] ?? 1;

    fetchMoreCards(columnId, page).then((newItems) => {
      pageRef.current[columnId] = page + 1;
      loadingColumns.current.delete(columnId);

      setDataSource((prev) => {
        const prevCol = prev[columnId];
        const updated = {
          ...prev,
          [columnId]: {
            ...prevCol,
            children: [...prevCol.children, ...newItems.map((i) => i.id)],
          },
        };
        newItems.forEach((item) => {
          updated[item.id] = item as unknown as BoardItem;
        });
        return updated;
      });
    });
  }, []);

  return (
    <div className="is-example">
      <div className="rkk-demo-page-header">
        <h1>Infinite Scroll</h1>
        <p>Each column loads more cards automatically as you scroll down</p>
      </div>

      <div className="rkk-demo-page-content">
        <Kanban
          dataSource={dataSource}
          configMap={{
            card: {
              render: ({ data }) => <InfiniteScrollCard data={data} />,
              isDraggable: true,
            },
          }}
          renderColumnHeader={(column) => <InfiniteScrollColumnHeader column={column} />}
          cardsGap={8}
          virtualization={true}
          loadMore={loadMore}
          onCardMove={(move) => {
            setDataSource(dropHandler(move, dataSource, () => { }));
          }}
          columnClassName={() => "is-column"}
          cardWrapperClassName="is-card-wrapper"
        />
      </div>
    </div>
  );
};

export default InfiniteScrollExample;
