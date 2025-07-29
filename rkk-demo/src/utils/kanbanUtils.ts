import type { BoardData } from "react-kanban-kit";

export const getAddCardPlaceholderKey = (columnId: string) =>
  `add-card-${columnId}`;

export const addCardPlaceholder = (
  columnId: string,
  dataSource: BoardData,
  inTop: boolean = true
): BoardData => {
  const addCardPlaceholderKey = getAddCardPlaceholderKey(columnId);

  const alreadyHasAddCardPlaceholder = dataSource[columnId].children.includes(
    addCardPlaceholderKey
  );

  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      totalChildrenCount: alreadyHasAddCardPlaceholder
        ? dataSource[columnId].totalChildrenCount - 1
        : dataSource[columnId].totalChildrenCount + 1,
      children: alreadyHasAddCardPlaceholder
        ? dataSource[columnId].children.filter(
            (child: string) => child !== addCardPlaceholderKey
          )
        : inTop
        ? [addCardPlaceholderKey, ...dataSource[columnId].children]
        : [...dataSource[columnId].children, addCardPlaceholderKey],
    },
    [addCardPlaceholderKey]: {
      id: addCardPlaceholderKey,
      title: "Add card",
      parentId: columnId,
      children: [],
      type: "new-card",
      content: {},
    },
  } as BoardData;
};

export const removeCardPlaceholder = (
  columnId: string,
  dataSource: BoardData
) => {
  const addCardPlaceholderKey = getAddCardPlaceholderKey(columnId);
  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      totalChildrenCount: dataSource[columnId].totalChildrenCount - 1,
      children: dataSource[columnId].children.filter(
        (child: string) => child !== addCardPlaceholderKey
      ),
    },
  };
};

export const addCard = (
  columnId: string,
  dataSource: BoardData,
  title: string
) => {
  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      totalItemsCount: (dataSource[columnId].totalItemsCount || 0) + 1,
      children: [
        ...dataSource[columnId].children.filter(
          (child: string) => child !== getAddCardPlaceholderKey(columnId)
        ),
        `task-${title}-${Date.now()}`,
      ],
    },
    [`task-${title}-${Date.now()}`]: {
      id: `task-${title}-${Date.now()}`,
      title,
      parentId: columnId,
      children: [],
      totalChildrenCount: 0,
      type: "card",
      content: {
        title,
        id: `task-${title}-${Date.now()}`,
      },
    },
  };
};

export const getPriorityColor = (priority: string) => {
  const colors = {
    high: "#ffc53d",
    medium: "#f59e0b",
    low: "#bbb",
    urgent: "#c62a2f",
  };
  return colors[priority as keyof typeof colors] || "#6b7280";
};
