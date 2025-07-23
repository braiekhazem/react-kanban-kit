import { BoardData, BoardItem, BoardProps } from "./types";
import {
  getColumnChildren,
  getColumnsFromDataSource,
} from "@/utils/columnsUtils";
import { withPrefix } from "@/utils/getPrefix";
import classNames from "classnames";
import { Column } from "./Column";

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
    onColumnMove,
    onCardMove,
    onColumnClick,
    onCardClick,
    renderColumnFooter,
    loadMore,
  } = props;

  const columns = getColumnsFromDataSource(dataSource);
  console.log({ dataSource, configMap, columns });

  const containerClassName = classNames(withPrefix("board"), rootClassName);

  return (
    <div className={containerClassName} style={rootStyle}>
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
          renderColumnWrapper={renderColumnWrapper}
          columnWrapperStyle={columnWrapperStyle}
          columnHeaderStyle={columnHeaderStyle}
          columnWrapperClassName={columnWrapperClassName}
          columnHeaderClassName={columnHeaderClassName}
          columnListContentStyle={columnListContentStyle}
          columnListContentClassName={columnListContentClassName}
        />
      ))}
    </div>
  );
};

export default Kanban;
