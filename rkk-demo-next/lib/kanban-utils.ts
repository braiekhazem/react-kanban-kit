import type { BoardData } from "react-kanban-kit";

export const getAddCardPlaceholderKey = (columnId: string) => `add-card-${columnId}`;

export const addCardPlaceholder = (columnId: string, dataSource: BoardData, inTop = true): BoardData => {
  const key = getAddCardPlaceholderKey(columnId);
  const already = dataSource[columnId].children.includes(key);
  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      totalChildrenCount: already
        ? dataSource[columnId].totalChildrenCount - 1
        : dataSource[columnId].totalChildrenCount + 1,
      children: already
        ? dataSource[columnId].children.filter((c: string) => c !== key)
        : inTop
          ? [key, ...dataSource[columnId].children]
          : [...dataSource[columnId].children, key],
    },
    [key]: { id: key, title: "Add card", parentId: columnId, children: [], type: "new-card", content: { inTop, id: key } },
  } as BoardData;
};

export const removeCardPlaceholder = (columnId: string, dataSource: BoardData) => {
  const key = getAddCardPlaceholderKey(columnId);
  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      totalChildrenCount: dataSource[columnId].totalChildrenCount - 1,
      children: dataSource[columnId].children.filter((c: string) => c !== key),
    },
  };
};

export const addCard = (columnId: string, dataSource: BoardData, title: string, inTop = true): BoardData => {
  const newId = `task-${title.slice(0, 8)}-${Date.now()}`;
  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      totalItemsCount: (dataSource[columnId].totalItemsCount || 0) + 1,
      children: [
        inTop ? newId : null,
        ...dataSource[columnId].children.filter((c: string) => c !== getAddCardPlaceholderKey(columnId)),
        !inTop ? newId : null,
      ].filter(Boolean),
    },
    [newId]: { id: newId, title, parentId: columnId, children: [], totalChildrenCount: 0, type: "card", content: { title, id: newId } },
  } as BoardData;
};

export const toggleCollapsedColumn = (columnId: string, dataSource: BoardData): BoardData => ({
  ...dataSource,
  [columnId]: {
    ...dataSource[columnId],
    content: { ...dataSource[columnId]?.content, isExpanded: !dataSource[columnId]?.content?.isExpanded },
  },
});

export const getPriorityColor = (priority: string) => {
  const map: Record<string, string> = {
    urgent: "#f43f5e", high: "#fb923c", medium: "#facc15", low: "#94a3b8",
  };
  return map[priority] || "#94a3b8";
};
