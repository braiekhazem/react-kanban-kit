import { withPrefix } from "@/utils/getPrefix";
import React from "react";
import { BoardItem, BoardProps, ConfigMap } from "../types";
import classNames from "classnames";
import { VList } from "virtua";
import GenericItem from "../GenericItem";

interface ListProps {
  column: BoardItem;
  items: BoardItem[];
  configMap: ConfigMap;
}

const VirtualizedList = ({ column, items, configMap }: ListProps) => {
  return (
    <VList
      count={column?.totalChildrenCount}
      onScroll={() => {}}
      className={withPrefix("column-content-list")}
    >
      {(index: number) => {
        const item = items[index];
        return (
          <GenericItem
            key={+(item?.id || 0) + index}
            index={index}
            options={{
              data: item,
              column,
              configMap,
              isSkeleton: index >= items.length,
            }}
          />
        );
      }}
    </VList>
  );
};

const NormalList = ({ column, items, configMap }: ListProps) => {
  return (
    <div className={withPrefix("column-content-list")}>
      {Array.from({ length: column?.totalChildrenCount }, (_, index) => (
        <GenericItem
          key={index}
          index={index}
          options={{
            data: items[index],
            column,
            configMap,
            isSkeleton: index >= items.length,
          }}
        />
      ))}
    </div>
  );
};

interface Props {
  items: BoardItem[];
  column: BoardItem;
  columnListContentStyle?: (column: BoardItem) => React.CSSProperties;
  columnListContentClassName?: string;
  configMap: ConfigMap;
  virtualization: boolean;
}

const ColumnContent = (props: Props) => {
  const {
    items,
    column,
    configMap,
    columnListContentStyle,
    columnListContentClassName,
    virtualization = true,
  } = props;

  const containerClassName = classNames(
    withPrefix("column-content"),
    columnListContentClassName
  );

  const List = virtualization ? VirtualizedList : NormalList;

  return (
    <div
      className={containerClassName}
      style={columnListContentStyle?.(column)}
    >
      <List column={column} items={items} configMap={configMap} />
    </div>
  );
};

export default ColumnContent;
