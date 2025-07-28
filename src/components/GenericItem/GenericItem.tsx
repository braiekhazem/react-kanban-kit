import React from "react";
import { BoardItem, BoardProps, ConfigMap, DndState } from "../types";
import classNames from "classnames";
import { withPrefix } from "@/utils/getPrefix";
import CardSkeleton from "../CardSkeleton";
import Card from "../Card";
import DefaultCard from "../DefaultCard";
import { CardShadow } from "../Card/Card";

const isCardDraggable = (data: BoardItem, isTypeDraggable: boolean) => {
  return data?.isDraggable !== undefined ? data?.isDraggable : isTypeDraggable;
};

interface Props {
  index: number;
  options: {
    data: BoardItem;
    column: BoardItem;
    configMap: ConfigMap;
    //isSkeleton is used to show a skeleton UI when the item is not loaded yet
    isSkeleton: boolean;
    isShadow: boolean;
    isListFooter: boolean;
    renderListFooter?: (column: BoardItem) => React.ReactNode;
    cardWrapperStyle?: (
      card: BoardItem,
      column: BoardItem
    ) => React.CSSProperties;
    cardWrapperClassName?: string;
    cardsGap?: number;
    renderSkeletonCard?: BoardProps["renderSkeletonCard"];
    onCardDndStateChange?: (info: DndState) => void;
    onCardClick?: (
      e: React.MouseEvent<HTMLDivElement>,
      card: BoardItem
    ) => void;
    cardOverHeight?: number;
    renderCardDragIndicator?: (card: BoardItem, info: any) => React.ReactNode;
    renderCardDragPreview?: (card: BoardItem, info: any) => React.ReactNode;
    renderGap?: (column: BoardItem) => React.ReactNode;
  };
}

const GenericItem = (props: Props) => {
  const { index, options } = props;
  const {
    data,
    column,
    configMap,
    isSkeleton,
    cardWrapperStyle,
    cardWrapperClassName,
    cardsGap = 8,
    isShadow,
    isListFooter,
    cardOverHeight = 90,
    renderSkeletonCard,
    onCardClick,
    onCardDndStateChange,
    renderCardDragIndicator,
    renderListFooter,
    renderGap,
  } = options;

  const { render = DefaultCard, isDraggable = true } =
    configMap?.[data?.type] || {};

  const wrapperClassName = classNames(
    withPrefix("generic-item-wrapper"),
    cardWrapperClassName
  );

  const renderCardContent = () => {
    if (isListFooter)
      return (
        <div className={withPrefix("generic-item-list-footer")}>
          {renderListFooter?.(column) || "Default Footer"}
        </div>
      );
    else if (isShadow)
      return (
        <CardShadow
          height={cardOverHeight}
          customIndicator={renderCardDragIndicator?.(data, {
            height: cardOverHeight,
          })}
        />
      );
    else if (isSkeleton)
      return (
        <div
          className={withPrefix("generic-item-skeleton")}
          data-index={index}
          data-rkk-column={column?.id}
        >
          {renderSkeletonCard?.({ index, column }) || (
            <CardSkeleton animationType="wave" />
          )}
        </div>
      );

    return (
      <Card
        render={render}
        isDraggable={isCardDraggable(data, isDraggable)}
        data={data}
        column={column}
        index={index}
        onClick={onCardClick}
        cardsGap={cardsGap}
        renderGap={renderGap}
        onCardDndStateChange={onCardDndStateChange}
        renderCardDragIndicator={renderCardDragIndicator}
      />
    );
  };

  return (
    <div
      className={wrapperClassName}
      style={{
        ...(cardWrapperStyle?.(data, column) || {}),
      }}
    >
      {renderCardContent()}
    </div>
  );
};

export default GenericItem;
