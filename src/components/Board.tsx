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
import { getColumnsFromDataSource } from "@/utils/columnsUtils";

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
    configMap,
    renderColumnHeader,
    renderColumnWrapper,
    columnWrapperStyle,
    columnHeaderStyle,
    columnWrapperClassName,
    columnHeaderClassName,
    containerStyle,
    onColumnMove,
    onCardMove,
    onColumnClick,
    onCardClick,
    renderFooterColumn,
    loadMore,
  } = props;

  const columns = getColumnsFromDataSource(dataSource);
  console.log({ dataSource, configMap, columns });

  return (
    <div className="board">
      {columns?.map((column, index) => {
        return (
          <BoardColumn
            key={column.id}
            column={column}
            index={index}
            tasks={getTasksByColumnId(column.id)}
            virtualizedItemCount={column?.totalChildrenCount || 0}
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
