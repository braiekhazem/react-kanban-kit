import { useEffect, useRef, useState } from "react";
import { BoardData, BoardItem, BoardProps, Column } from "./types";
import { autoScroller } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import BoardColumn from "./BoardColumn";
import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/types";

//TODO: fix nested level expand and collapse system for nested subtasks

export const dropColumnHandler = (
  drop: { columnId: string; position: number },
  dataSource: BoardData
) => {
  const { columnId, position } = drop;
  const newDataSource = { ...dataSource };
  const rootChildren = [...(newDataSource["root"]?.children || [])];
  const currentIndex = rootChildren.indexOf(columnId);

  if (currentIndex === -1) return newDataSource;

  rootChildren.splice(currentIndex, 1);
  rootChildren.splice(position, 0, columnId);
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
  updateSourceColumn?: (sourceColumn: BoardItem) => any
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
      newDataSource[fromColumnId]
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
      newDataSource[cardId]
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
      newDataSource[toColumnId]
    );

  return newDataSource;
};

const isCardData = (data: any) => data?.type === "card";
const isColumnData = (data: any) => data?.type === "column";

const Board = (props: BoardProps) => {
  const {
    dataSource,
    renderCard,
    renderColumnHeader,
    renderTaskAdder,
    onColumnMove,
    onCardMove,
    containerStyle,
    columnContainerStyle,
    loadMore,
    maxNestedLevel = 1,
    renderFooterTasksList,
    renderFooterColumn,
    onColumnClick,
  } = props;

  const [columns, setColumns] = useState<Column[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);

  useEffect(() => {
    if (!dataSource) return;

    const defaultColumns = dataSource["root"]?.children?.map(
      (id) => dataSource[id]
    );

    if (defaultColumns) {
      setColumns(
        defaultColumns.map((col) => {
          const column = col?.content;
          return {
            ...col,
            id: col?.id || "",
            name: column?.group?.name,
            totalItems: dataSource[col?.id || ""]?.totalItems,
            content: column?.group,
            isExpanded: col?.isExpanded,
          };
        })
      );
    }
  }, [dataSource]);

  // useEffect(() => {
  //   const boardElement = ref.current;
  //   if (!boardElement) return;

  //   let isMouseDown = false;
  //   let startX: number;
  //   let startScrollLeft: number;

  //   const handleMouseDown = (e: MouseEvent) => {
  //     if (
  //       (e.target as HTMLElement).closest(
  //         ".board-task-card, .column-header, .task-fields"
  //       )
  //     )
  //       return;

  //     isMouseDown = true;
  //     // setIsGrabbing(true);
  //     startX = e.pageX - boardElement.offsetLeft;
  //     startScrollLeft = boardElement.scrollLeft;

  //     e.preventDefault();
  //   };

  //   const handleMouseUp = () => {
  //     isMouseDown = false;
  //     // setIsGrabbing(false);
  //   };

  //   const handleMouseMove = (e: MouseEvent) => {
  //     if (!isMouseDown) return;
  //     const x = e.pageX - boardElement.offsetLeft;
  //     const scroll = startScrollLeft - (x - startX);
  //     boardElement.scrollLeft = scroll;
  //   };

  //   const handleMouseLeave = () => {
  //     isMouseDown = false;
  //     setIsGrabbing(false);
  //   };

  //   boardElement.addEventListener("mousedown", handleMouseDown);
  //   document.addEventListener("mouseup", handleMouseUp);
  //   document.addEventListener("mousemove", handleMouseMove);
  //   boardElement.addEventListener("mouseleave", handleMouseLeave);

  //   return () => {
  //     boardElement.removeEventListener("mousedown", handleMouseDown);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     boardElement.removeEventListener("mouseleave", handleMouseLeave);
  //   };
  // }, []);

  const getTaskWithSubtasks = (
    taskId: string,
    isExpanded = false,
    parentTask: BoardItem | null = null,
    depth = 0
  ) => {
    const task = dataSource[taskId];
    if (!task) return [];

    const result = [
      {
        ...task,
        isSubtask: Boolean(parentTask),
        parentId: parentTask?.id || task?.parentId,
      },
    ];

    if (task.isExpanded === false || !isExpanded || depth >= maxNestedLevel)
      return result;

    const childTasks: BoardItem[] = [];
    const childIds = task.children || [];
    childIds.forEach((childId) => {
      const childTask = getTaskWithSubtasks(
        childId,
        task.isExpanded,
        task,
        depth + 1
      );
      childTasks.push(...childTask);
    });

    return [...result, ...childTasks];
  };

  const getTasksByColumnId = (columnId: string) => {
    const tasks: BoardItem[] = [];
    const column = dataSource[columnId];
    if (!column) return tasks;
    const parentTasks = column.children;
    parentTasks?.forEach((taskId) => {
      const task = dataSource[taskId];
      if (task) {
        const tasksWithSubtasks = getTaskWithSubtasks(taskId, task.isExpanded);
        tasks.push(...tasksWithSubtasks);
      }
    });
    return tasks;
  };

  interface DropParams {
    source: {
      id: string;
      data: any;
    };
    location: {
      current: {
        dropTargets: Array<{
          data: any;
        }>;
      };
    };
    columns: Column[];
    dataSource: BoardData;
    onCardMove?: BoardProps["onCardMove"];
    onColumnMove?: BoardProps["onColumnMove"];
  }

  const handleCardDrop = ({
    source,
    location,
    columns,
    dataSource,
    onCardMove,
    onColumnMove,
  }: DropParams) => {
    // Handle column reordering
    if (isColumnData(source.data)) {
      if (!onColumnMove) return;

      const sourceColumnId = source.data.columnId;
      // const sourceIndex = source.data.index

      // Find innermost drop target
      //@ts-ignore
      const innerMost = location.current.dropTargets[0];
      if (!innerMost) return;

      const dropTargetData = innerMost.data;

      // Only proceed if dropping on another column
      if (isColumnData(dropTargetData)) {
        const targetColumnId = dropTargetData.columnId;
        const targetIndex = columns.findIndex(
          (col) => col.id === targetColumnId
        );

        if (targetIndex === -1) return;

        // Don't reorder if dropped on itself
        if (sourceColumnId === targetColumnId) return;

        // Call the provided onColumnMove handler
        onColumnMove?.({
          columnId: sourceColumnId,
          fromIndex: columns.findIndex((col) => col.id === sourceColumnId),
          toIndex: targetIndex,
        });
      }

      return;
    }

    // Handle card reordering
    if (!isCardData(source.data)) {
      return;
    }

    const draggingCardId = source.data.itemId;
    const sourceColumnId = source.data.columnId;
    // const sourceCardIndex = source.data.index

    // Find innermost drop target (card or column)
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
        const allTasks = getTasksByColumnId(targetColumnId);

        // Find source and target indices
        const sourceIndex = allTasks.findIndex(
          (task) => task.id === draggingCardId
        );
        const targetIndex = allTasks.findIndex(
          (task) => task.id === targetCardId
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
          (task) => task.id === draggingCardId
        );

        // Find tasks above and below the insertion point
        const taskAbove = newPosition > 0 ? reordered[newPosition - 1] : null;
        const taskBelow =
          newPosition < reordered.length - 1
            ? reordered[newPosition + 1]
            : null;

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
        const allTargetTasks = getTasksByColumnId(targetColumnId);

        // Find the target task index
        const targetIndex = allTargetTasks.findIndex(
          (task) => task.id === targetCardId
        );
        if (targetIndex === -1) return;
        const finalIndex =
          closestEdge === "bottom" ? targetIndex + 1 : targetIndex;

        // Get the dragging task from source column
        const draggingTask = getTasksByColumnId(sourceColumnId).find(
          (task) => task.id === draggingCardId
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
          (task) => task.id === draggingCardId
        );

        const taskAbove = newPosition > 0 ? reordered[newPosition - 1] : null;
        const taskBelow =
          newPosition < reordered.length - 1
            ? reordered[newPosition + 1]
            : null;

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
      const targetTasks = getTasksByColumnId(targetColumnId);
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

  useEffect(() => {
    if (!ref.current) return;

    return combine(
      monitorForElements({
        onDragStart({ location }) {
          autoScroller.start({ input: location.current.input });
        },
        onDrag({ location }) {
          autoScroller.updateInput({ input: location.current.input });
        },
        onDrop(args) {
          autoScroller.stop();

          handleCardDrop({
            source: {
              id: (args.source as any).id || "",
              data: args.source.data,
            },
            location: {
              current: {
                dropTargets: args.location.current.dropTargets,
              },
            },
            columns,
            dataSource,
            onCardMove,
            onColumnMove,
          });
        },
      }),
      autoScrollForElements({
        element: ref.current,
        canScroll: () => true,
        getConfiguration: () => ({
          maxScrollSpeed: "standard",
        }),
      })
    );
  }, [columns, dataSource, onCardMove, onColumnMove]);

  const calculateTotalItems = (columnId: string) => {
    const totalItems = dataSource?.[columnId]?.totalItems || 0;
    const loadedTasksCount = dataSource?.[columnId]?.children?.length;
    const loadedTasksWithSubtasksCount = getTasksByColumnId(columnId).length;
    //TODO: fix adder by dynamic condition
    const withAdder = dataSource?.[columnId]?.children?.includes(
      `${columnId}-task-adder`
    );
    return (
      totalItems +
      loadedTasksWithSubtasksCount -
      loadedTasksCount +
      (withAdder ? 1 : 0)
    );
  };

  const boardStyles = {
    ...containerStyle,
    cursor: isGrabbing ? "grabbing" : "default",
    overflowX: "auto" as const,
    userSelect: "none" as const,
  };

  console.log({ columns, dataSource });

  return (
    <div ref={ref} className="board" style={boardStyles}>
      {columns?.map((column) => {
        return (
          <BoardColumn
            key={column.id}
            column={column}
            index={columns.findIndex((col) => col.id === column.id)}
            tasks={getTasksByColumnId(column.id)}
            virtualizedItemCount={calculateTotalItems(column.id)}
            renderCard={renderCard}
            renderColumnHeader={renderColumnHeader}
            loadMore={loadMore}
            containerStyle={columnContainerStyle?.(column)}
            renderTaskAdder={renderTaskAdder}
            renderFooterTasksList={renderFooterTasksList}
            renderFooterColumn={renderFooterColumn}
            isExpanded={column.isExpanded}
            onColumnClick={onColumnClick}
          />
        );
      })}
    </div>
  );
};

export default Board;
