import {
  BoardData,
  BoardItem,
  DropColumnParams,
  DropParams,
} from "@/components";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

const isCardData = (data: Record<string, unknown>) => data?.type === "card";
const isColumnData = (data: Record<string, unknown>) => data?.type === "column";

const getTasksByColumnId = (columnId: string, dataSource: BoardData) => {
  const tasks: BoardItem[] = [];
  const column = dataSource[columnId];
  if (!column) return tasks;
  const parentTasks = column.children;
  parentTasks?.forEach((taskId) => {
    const task = dataSource[taskId];
    if (task) tasks.push(task);
  });
  return tasks;
};

export const handleCardDrop = ({
  source,
  location,
  columns,
  dataSource,
  onCardMove,
  onColumnMove,
}: DropParams) => {
  // ── Column drop ───────────────────────────────────────────────────
  if (isColumnData(source.data)) {
    if (!onColumnMove) return;

    const innerMost = location.current.dropTargets[0];
    if (!innerMost) return;

    const dropTargetData = innerMost.data;
    if (!isColumnData(dropTargetData)) return;

    const sourceColumnId = source.data.columnId as string;
    const targetColumnId = dropTargetData.columnId as string;
    if (sourceColumnId === targetColumnId) return;

    const sourceIndex = columns.findIndex((c) => c.id === sourceColumnId);
    const targetIndex = columns.findIndex((c) => c.id === targetColumnId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const closestEdge = extractClosestEdge(dropTargetData);
    const reordered = reorderWithEdge({
      axis: "horizontal",
      list: columns,
      startIndex: sourceIndex,
      indexOfTarget: targetIndex,
      closestEdgeOfTarget: closestEdge,
    });

    onColumnMove({
      columnId: sourceColumnId,
      fromIndex: sourceIndex,
      toIndex: reordered.findIndex((c) => c.id === sourceColumnId),
    });

    return;
  }

  if (!isCardData(source.data)) return;

  const draggingCardId = source.data.itemId;
  const sourceColumnId = source.data.columnId;

  const innerMost = location.current.dropTargets[0];
  if (!innerMost) return;

  const dropTargetData = innerMost.data;

  // Case 1: Dropping on another card
  if (dropTargetData["card-drop-target"]) {
    const targetColumnId = dropTargetData.columnId;
    const targetCardId = dropTargetData.itemId;
    const closestEdge = extractClosestEdge(dropTargetData);

    // Find the cards involved
    const sourceColumn = dataSource[sourceColumnId];
    const targetColumn = dataSource[targetColumnId];

    if (!sourceColumn || !targetColumn) return;

    // For same column reordering
    if (sourceColumnId === targetColumnId) {
      // Get all tasks in the column
      const allTasks = getTasksByColumnId(targetColumnId, dataSource);

      // Find source and target indices
      const sourceIndex = allTasks.findIndex(
        (task) => task.id === draggingCardId,
      );
      const targetIndex = allTasks.findIndex(
        (task) => task.id === targetCardId,
      );

      if (sourceIndex === -1 || targetIndex === -1) return;

      // No change needed if same position
      if (sourceIndex === targetIndex) return;

      // Use reorderWithEdge to get the correct new order
      const reordered = reorderWithEdge({
        axis: "vertical",
        list: allTasks,
        startIndex: sourceIndex,
        indexOfTarget: targetIndex,
        closestEdgeOfTarget: closestEdge,
      });

      // Calculate the new position based on the reordered array
      const newPosition = reordered.findIndex(
        (task) => task.id === draggingCardId,
      );

      // Find tasks above and below the insertion point
      const taskAbove = newPosition > 0 ? reordered[newPosition - 1] : null;
      const taskBelow =
        newPosition < reordered.length - 1 ? reordered[newPosition + 1] : null;

      // Call the provided onCardMove handler
      if (onCardMove) {
        onCardMove({
          cardId: draggingCardId,
          fromColumnId: sourceColumnId,
          toColumnId: targetColumnId,
          taskAbove: taskAbove?.id,
          taskBelow: taskBelow?.id,
          position: newPosition,
        });
      }
    }
    // Moving between columns
    else {
      // Get all tasks in the target column
      const allTargetTasks = getTasksByColumnId(targetColumnId, dataSource);

      // Find the target task index
      const targetIndex = allTargetTasks.findIndex(
        (task) => task.id === targetCardId,
      );
      if (targetIndex === -1) return;
      const finalIndex =
        closestEdge === "bottom" ? targetIndex + 1 : targetIndex;

      // Get the dragging task from source column
      const draggingTask = getTasksByColumnId(sourceColumnId, dataSource).find(
        (task) => task.id === draggingCardId,
      );
      if (!draggingTask) return;

      // Create a temporary array with the dragging task inserted at the target position
      const tempArray = [...allTargetTasks];
      tempArray.splice(finalIndex, 0, draggingTask);

      // Use reorderWithEdge to get the correct final position
      const reordered = reorderWithEdge({
        axis: "vertical",
        list: tempArray,
        startIndex: finalIndex,
        indexOfTarget: finalIndex,
        closestEdgeOfTarget: closestEdge,
      });

      // Calculate the new position based on the reordered array
      const newPosition = reordered.findIndex(
        (task) => task.id === draggingCardId,
      );

      const taskAbove = newPosition > 0 ? reordered[newPosition - 1] : null;
      const taskBelow =
        newPosition < reordered.length - 1 ? reordered[newPosition + 1] : null;

      if (onCardMove) {
        onCardMove({
          cardId: draggingCardId,
          fromColumnId: sourceColumnId,
          toColumnId: targetColumnId,
          taskAbove: taskAbove?.id,
          taskBelow: taskBelow?.id,
          position: newPosition,
        });
      }
    }
  }
  // Case 2: Dropping directly on a column (not on a card)
  else if (isColumnData(dropTargetData)) {
    const targetColumnId = dropTargetData.columnId;
    const targetTasks = getTasksByColumnId(targetColumnId, dataSource);
    const taskAbove =
      targetTasks.length > 0 ? targetTasks[targetTasks.length - 1] : null;

    if (onCardMove) {
      onCardMove({
        cardId: draggingCardId,
        fromColumnId: sourceColumnId,
        toColumnId: targetColumnId,
        taskAbove: taskAbove?.id,
        taskBelow: null,
        position: targetTasks.length,
      });
    }
  }
};

export const dropColumnHandler = (
  drop: DropColumnParams,
  dataSource: BoardData,
) => {
  const { columnId, toIndex } = drop;
  const newDataSource = { ...dataSource };
  const rootChildren = [...(newDataSource["root"]?.children || [])];
  const currentIndex = rootChildren.indexOf(columnId);

  if (currentIndex === -1) return newDataSource;

  rootChildren.splice(currentIndex, 1);
  rootChildren.splice(toIndex, 0, columnId);
  if (newDataSource["root"]) {
    newDataSource["root"].children = rootChildren;
  }

  return newDataSource;
};

export const dropHandler = (
  drop: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    taskAbove: string | null;
    taskBelow: string | null;
  },
  dataSource: BoardData,
  updateDroppedItem?: (targetColumn: BoardItem, droppedItem: any) => any,
  updateDestinationColumn?: (targetColumn: BoardItem) => any,
  updateSourceColumn?: (sourceColumn: BoardItem) => any,
) => {
  const { cardId, fromColumnId, toColumnId, taskAbove, taskBelow } = drop;

  const newDataSource = { ...dataSource };

  if (newDataSource[fromColumnId]?.children) {
    newDataSource[fromColumnId].children = newDataSource[
      fromColumnId
    ].children.filter((id: string) => id !== cardId);
    if (
      newDataSource[fromColumnId]?.totalItems !== undefined &&
      newDataSource[fromColumnId].totalItems > 0
    )
      newDataSource[fromColumnId].totalItems--;
  }

  if (updateSourceColumn && newDataSource[fromColumnId])
    newDataSource[fromColumnId] = updateSourceColumn(
      newDataSource[fromColumnId],
    );

  const targetChildren = newDataSource[toColumnId]?.children || [];
  let insertIndex = 0;

  if (taskAbove) insertIndex = targetChildren.indexOf(taskAbove) + 1;
  else if (taskBelow) insertIndex = targetChildren.indexOf(taskBelow);

  const alreadyExistInTarget = targetChildren.includes(cardId);

  if (
    newDataSource[toColumnId]?.totalItems !== undefined &&
    !alreadyExistInTarget
  )
    newDataSource[toColumnId].totalItems++;

  if (updateDroppedItem && newDataSource[cardId]) {
    const updatedItem = updateDroppedItem?.(
      newDataSource[toColumnId],
      newDataSource[cardId],
    );
    newDataSource[cardId] = updatedItem || newDataSource[cardId];
  }

  if (newDataSource[toColumnId]?.children) {
    newDataSource[toColumnId].children = newDataSource[
      toColumnId
    ]?.children?.filter((id: string) => id !== cardId);
    newDataSource[toColumnId].children.splice(insertIndex, 0, cardId);
  }

  if (updateDestinationColumn && newDataSource[toColumnId])
    newDataSource[toColumnId] = updateDestinationColumn(
      newDataSource[toColumnId],
    );

  return newDataSource;
};
