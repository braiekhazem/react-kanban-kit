import { withPrefix } from "@/utils/getPrefix";
import React, { forwardRef, useEffect } from "react";
import { BoardItem, BoardProps, ConfigMap, ScrollEvent } from "../types";
import classNames from "classnames";
import { VList } from "virtua";
import GenericItem from "../GenericItem";
import { handleScroll } from "@/utils/scroll";
import { checkIfSkeletonIsVisible } from "@/utils/infinite-scroll";

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
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  onCardClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
}

const VirtualizedList = ({
  column,
  items,
  configMap,
  onScroll,
  ...props
}: ListProps) => {
  return (
    <VList
      count={column?.totalChildrenCount}
      onScroll={onScroll}
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

const NormalList = ({
  column,
  items,
  configMap,
  onScroll,
  ...props
}: ListProps) => {
  return (
    <div className={withPrefix("column-content-list")} onScroll={onScroll}>
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
  onScroll?: (e: ScrollEvent, column: BoardItem) => void;
  onCardClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
  loadMore?: (columnId: string) => void;
}

const ColumnContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
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
    onCardClick,
    loadMore,
  } = props;

  const containerClassName = classNames(
    withPrefix("column-content"),
    columnListContentClassName
  );

  const onScroll = (e: ScrollEvent, column: BoardItem) => {
    const isSkeletonVisible = checkIfSkeletonIsVisible({
      columnId: column?.id,
    });
    if (isSkeletonVisible) loadMore?.(column?.id);
    props?.onScroll?.(e, column);
  };

  const List = virtualization ? VirtualizedList : NormalList;

  return (
    <div
      ref={ref}
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
        onScroll={(e) => handleScroll(e, virtualization, onScroll, column)}
        onCardClick={onCardClick}
      />
    </div>
  );
});

export default ColumnContent;
