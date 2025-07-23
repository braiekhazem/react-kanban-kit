import { BoardData, BoardItem, BoardProps } from "./types";
import {
  getColumnChildren,
  getColumnsFromDataSource,
} from "@/utils/columnsUtils";
import { withPrefix } from "@/utils/getPrefix";
import classNames from "classnames";
import { Column } from "./Column";
import { useEffect, useRef } from "react";

import { autoScroller } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

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
  columns: BoardItem[];
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
  console.log({
    source,
    location,
    columns,
    dataSource,
    onCardMove,
    onColumnMove,
  });
};

const Kanban = (props: BoardProps) => {
  const {
    dataSource,
    configMap,
    renderColumnHeader,
    renderColumnWrapper,
    columnWrapperStyle,
    columnHeaderStyle,
    columnWrapperClassName,
    columnHeaderClassName,
    columnListContentStyle,
    columnListContentClassName,
    rootStyle = {},
    rootClassName,
    onScroll,
    onColumnMove,
    onCardMove,
    onColumnClick,
    onCardClick,
    renderColumnFooter,
    renderSkeletonCard,
    loadMore,
    virtualization,
    cardWrapperStyle,
    cardWrapperClassName,
    cardsGap,
  } = props;

  const columns = getColumnsFromDataSource(dataSource);
  const internalRef = useRef<HTMLDivElement>(null);
  console.log({ dataSource, configMap, columns });

  useEffect(() => {
    if (!internalRef.current) return;

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
        element: internalRef.current,
        canScroll: () => true,
        getConfiguration: () => ({
          maxScrollSpeed: "standard",
        }),
      })
    );
  }, [columns, dataSource, onCardMove, onColumnMove]);

  const containerClassName = classNames(withPrefix("board"), rootClassName);

  return (
    <div ref={internalRef} className={containerClassName} style={rootStyle}>
      {columns?.map((column, index) => (
        <Column
          key={column.id || index}
          index={index}
          data={column}
          configMap={configMap}
          loadMore={loadMore}
          items={getColumnChildren(column, dataSource)}
          onColumnClick={onColumnClick}
          onCardClick={onCardClick}
          renderColumnHeader={renderColumnHeader}
          renderColumnFooter={renderColumnFooter}
          renderSkeletonCard={renderSkeletonCard}
          renderColumnWrapper={renderColumnWrapper}
          columnWrapperStyle={columnWrapperStyle}
          columnHeaderStyle={columnHeaderStyle}
          columnWrapperClassName={columnWrapperClassName}
          columnHeaderClassName={columnHeaderClassName}
          columnListContentStyle={columnListContentStyle}
          columnListContentClassName={columnListContentClassName}
          virtualization={virtualization}
          cardWrapperStyle={cardWrapperStyle}
          cardWrapperClassName={cardWrapperClassName}
          cardsGap={cardsGap}
          onScroll={onScroll}
        />
      ))}
    </div>
  );
};

export default Kanban;
