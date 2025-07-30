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
      content: {
        inTop,
        id: addCardPlaceholderKey,
      },
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
  title: string,
  inTop: boolean = true
): BoardData => {
  const newTaskId = `task-${title}-${Date.now()}`;
  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      totalItemsCount: (dataSource[columnId].totalItemsCount || 0) + 1,
      children: [
        inTop ? newTaskId : null,
        ...dataSource[columnId].children.filter(
          (child: string) => child !== getAddCardPlaceholderKey(columnId)
        ),
        !inTop ? newTaskId : null,
      ].filter(Boolean),
    },
    [newTaskId]: {
      id: newTaskId,
      title,
      parentId: columnId,
      children: [],
      totalChildrenCount: 0,
      type: "card",
      content: {
        title,
        id: newTaskId,
      },
    },
  } as BoardData;
};

export const toggleCollapsedColumn = (
  columnId: string,
  dataSource: BoardData
): BoardData => {
  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      content: {
        ...dataSource?.[columnId]?.content,
        isExpanded: !dataSource?.[columnId]?.content?.isExpanded,
      },
    },
  };
};

export const toggleCardOver = (
  columnId: string,
  dataSource: BoardData
): BoardData => {
  return {
    ...dataSource,
    [columnId]: {
      ...dataSource[columnId],
      content: {
        ...dataSource?.[columnId]?.content,
        isCardOver: !dataSource?.[columnId]?.content?.isCardOver,
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

export const increaseColumnTotalItemsCount = (dataSource: BoardData) => {
  const columnsIds = dataSource?.root?.children;
  columnsIds.forEach((columnId: string) => {
    dataSource[columnId].totalChildrenCount =
      (dataSource[columnId].totalChildrenCount || 0) + 200;
    dataSource[columnId].totalItemsCount =
      (dataSource[columnId].totalItemsCount || 0) + 200;
  });
  return dataSource;
};

export const fetchTasks = (columnId: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(200);
    }, 1000);
  });
};
