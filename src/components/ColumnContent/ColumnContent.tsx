import { withPrefix } from "@/utils/getPrefix";
import React, { forwardRef, useEffect } from "react";
import {
  BoardItem,
  BoardProps,
  ConfigMap,
  DndState,
  ScrollEvent,
} from "../types";
import classNames from "classnames";
import { VList } from "virtua";
import GenericItem from "../GenericItem";
import { handleScroll } from "@/utils/scroll";
import { checkIfSkeletonIsVisible } from "@/utils/infinite-scroll";
import { useKanbanContext } from "@/context/KanbanContext";

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
  cardOverHeight?: number;
  cardOverShadowCount?: number;
  renderCardDragIndicator?: (card: BoardItem, info: any) => React.ReactNode;
  renderCardDragPreview?: (card: BoardItem, info: any) => React.ReactNode;
  onCardDndStateChange?: (info: DndState) => void;
  renderSkeletonCard?: BoardProps["renderSkeletonCard"];
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  onCardClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
  renderListFooter?: (column: BoardItem) => React.ReactNode;
  renderGap?: (column: BoardItem) => React.ReactNode;
}

const renderGenericItem = (
  items: BoardItem[],
  index: number,
  column: BoardItem,
  configMap: ConfigMap,
  cardOverShadowCount: number,
  renderListFooter: (column: BoardItem) => React.ReactNode,
  props: any,
  count: number
) => {
  return (
    <GenericItem
      key={index}
      index={index}
      options={{
        data: items[index],
        column,
        configMap,
        isSkeleton: index >= items.length,
        renderListFooter,
        isShadow:
          cardOverShadowCount && index === count - (renderListFooter ? 2 : 1),
        isListFooter:
          renderListFooter && index === count - (renderListFooter ? 1 : 0),
        ...props,
      }}
    />
  );
};

const VirtualizedList = ({
  column,
  items,
  configMap,
  onScroll,
  cardOverShadowCount,
  renderListFooter,
  ...props
}: ListProps) => {
  const count =
    column?.totalChildrenCount +
    cardOverShadowCount +
    (renderListFooter ? 1 : 0);

  return (
    <VList
      count={count}
      onScroll={onScroll}
      className={withPrefix("column-content-list")}
    >
      {(index: number) =>
        renderGenericItem(
          items,
          index,
          column,
          configMap,
          cardOverShadowCount,
          renderListFooter,
          props,
          count
        )
      }
    </VList>
  );
};

const NormalList = ({
  column,
  items,
  configMap,
  onScroll,
  cardOverShadowCount,
  renderListFooter,
  ...props
}: ListProps) => {
  const count =
    column?.totalChildrenCount +
    cardOverShadowCount +
    (renderListFooter ? 1 : 0);

  return (
    <div className={withPrefix("column-content-list")} onScroll={onScroll}>
      {Array.from(
        {
          length: count,
        },
        (_, index) =>
          renderGenericItem(
            items,
            index,
            column,
            configMap,
            cardOverShadowCount,
            renderListFooter,
            props,
            count
          )
      )}
    </div>
  );
};

interface Props {
  items: BoardItem[];
  column: BoardItem;
  columnListContentStyle?: (column: BoardItem) => React.CSSProperties;
  columnListContentClassName?: string;
  configMap: ConfigMap;
  renderSkeletonCard?: BoardProps["renderSkeletonCard"];
  cardWrapperStyle?: (
    card: BoardItem,
    column: BoardItem
  ) => React.CSSProperties;
  cardWrapperClassName?: string;
  onScroll?: (e: ScrollEvent, column: BoardItem) => void;
  onCardClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
  loadMore?: (columnId: string) => void;
  cardOverShadowCount?: number;
  cardOverHeight?: number;
  onCardDndStateChange?: (info: DndState) => void;
  renderCardDragIndicator?: (card: BoardItem, info: any) => React.ReactNode;
  renderCardDragPreview?: (card: BoardItem, info: any) => React.ReactNode;
  renderListFooter?: (column: BoardItem) => React.ReactNode;
  renderGap?: (column: BoardItem) => React.ReactNode;
}

const ColumnContent = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    items,
    column,
    configMap,
    columnListContentStyle,
    columnListContentClassName,
    cardWrapperStyle,
    renderSkeletonCard,
    cardWrapperClassName,
    onCardClick,
    loadMore,
    cardOverShadowCount,
    cardOverHeight,
    onCardDndStateChange,
    renderCardDragIndicator,
    renderCardDragPreview,
    renderListFooter,
    renderGap,
  } = props;
  const {
    virtualization = true,
    cardsGap,
    allowListFooter,
  } = useKanbanContext();
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
        cardOverShadowCount={cardOverShadowCount}
        onCardDndStateChange={onCardDndStateChange}
        renderCardDragIndicator={renderCardDragIndicator}
        renderCardDragPreview={renderCardDragPreview}
        cardOverHeight={cardOverHeight}
        renderGap={renderGap}
        renderListFooter={
          (allowListFooter !== undefined && allowListFooter?.(column)) ||
          allowListFooter === undefined
            ? renderListFooter
            : null
        }
      />
    </div>
  );
});

export default ColumnContent;
