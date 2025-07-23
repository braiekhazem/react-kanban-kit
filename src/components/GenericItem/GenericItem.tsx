import React from "react";
import { BoardItem, BoardProps, ConfigMap } from "../types";
import classNames from "classnames";
import { withPrefix } from "@/utils/getPrefix";
import CardSkeleton from "../CardSkeleton";
import Card from "../Card";
import DefaultCard from "../DefaultCard";

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
    cardWrapperStyle?: (
      card: BoardItem,
      column: BoardItem
    ) => React.CSSProperties;
    cardWrapperClassName?: string;
    cardsGap?: number;
    renderSkeletonCard?: BoardProps["renderSkeletonCard"];
    onCardClick?: (
      e: React.MouseEvent<HTMLDivElement>,
      card: BoardItem
    ) => void;
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
    cardsGap,
    renderSkeletonCard,
    onCardClick,
  } = options;

  const { render = DefaultCard, isDraggable = true } =
    configMap[data?.type] || {};

  const wrapperClassName = classNames(
    withPrefix("generic-item-wrapper"),
    cardWrapperClassName
  );

  return (
    <div
      className={wrapperClassName}
      style={{
        ...(cardWrapperStyle?.(data, column) || {}),
        ...(cardsGap !== undefined ? { marginBottom: `${cardsGap}px` } : {}),
      }}
    >
      {isSkeleton ? (
        <div
          className={withPrefix("generic-item-skeleton")}
          data-index={index}
          data-rkk-column={column?.id}
        >
          {renderSkeletonCard?.({ index, column }) || (
            <CardSkeleton animationType="wave" />
          )}
        </div>
      ) : (
        <Card
          render={render}
          isDraggable={isCardDraggable(data, isDraggable)}
          data={data}
          column={column}
          index={index}
          onClick={onCardClick}
        />
      )}
    </div>
  );
};

export default GenericItem;
