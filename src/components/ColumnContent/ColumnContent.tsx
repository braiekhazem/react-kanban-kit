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
  cardWrapperStyle?: (
    card: BoardItem,
    column: BoardItem
  ) => React.CSSProperties;
  cardWrapperClassName?: string;
  cardsGap?: number;
  renderSkeletonCard?: BoardProps["renderSkeletonCard"];
}

const VirtualizedList = ({ column, items, configMap, ...props }: ListProps) => {
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
            key={index}
            index={index}
            options={{
              data: item,
              column,
              configMap,
              isSkeleton: index >= items.length,
              ...props,
            }}
          />
        );
      }}
    </VList>
  );
};

const NormalList = ({ column, items, configMap, ...props }: ListProps) => {
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
            ...props,
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
  renderSkeletonCard?: BoardProps["renderSkeletonCard"];
  cardWrapperStyle?: (
    card: BoardItem,
    column: BoardItem
  ) => React.CSSProperties;
  cardWrapperClassName?: string;
  cardsGap?: number;
}

const ColumnContent = (props: Props) => {
  const {
    items,
    column,
    configMap,
    columnListContentStyle,
    columnListContentClassName,
    virtualization = true,
    cardWrapperStyle,
    renderSkeletonCard,
    cardWrapperClassName,
    cardsGap,
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
      <List
        column={column}
        items={items}
        configMap={configMap}
        cardWrapperStyle={cardWrapperStyle}
        cardWrapperClassName={cardWrapperClassName}
        cardsGap={cardsGap}
        renderSkeletonCard={renderSkeletonCard}
      />
    </div>
  );
};

export default ColumnContent;
