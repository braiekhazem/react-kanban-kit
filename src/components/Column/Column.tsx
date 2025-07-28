import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  BoardItem,
  BoardProps,
  ConfigMap,
  DndState,
  ScrollEvent,
} from "../types";
import { withPrefix } from "@/utils/getPrefix";
import classNames from "classnames";
import ColumnHeader from "../ColumnHeader";
import ColumnContent from "../ColumnContent";
import { useColumnDnd } from "@/global/dnd/useColumnDnd";

interface Props {
  index: number;
  data: BoardItem;
  configMap: ConfigMap;
  loadMore?: (columnId: string) => void;
  onColumnClick?: (
    e: React.MouseEvent<HTMLDivElement>,
    column: BoardItem
  ) => void;
  onCardClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
  renderColumnHeader?: (column: BoardItem) => React.ReactNode;
  renderColumnFooter?: (column: BoardItem) => React.ReactNode;
  renderSkeletonCard?: BoardProps["renderSkeletonCard"];
  renderGap?: (column: BoardItem) => React.ReactNode;
  renderColumnWrapper: (
    column: BoardItem,
    {
      children,
      className,
      style,
      ref,
    }: {
      children: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      ref?: React.RefObject<HTMLDivElement>;
    }
  ) => React.ReactNode;
  columnWrapperStyle?: (column: BoardItem) => React.CSSProperties;
  columnHeaderStyle?: (column: BoardItem) => React.CSSProperties;
  columnStyle?: (column: BoardItem) => React.CSSProperties;
  columnClassName?: (column: BoardItem) => string;
  onCardDndStateChange?: (info: DndState) => void;
  onColumnDndStateChange?: (info: DndState) => void;
  columnWrapperClassName?: (column: BoardItem) => string;
  columnHeaderClassName?: (column: BoardItem) => string;
  columnListContentStyle?: (column: BoardItem) => React.CSSProperties;
  renderCardDragIndicator?: (card: BoardItem, info: any) => React.ReactNode;
  renderColumnDragIndicator?: (column: BoardItem, info: any) => React.ReactNode;
  renderCardDragPreview?: (card: BoardItem, info: any) => React.ReactNode;
  renderColumnDragPreview?: (column: BoardItem, info: any) => React.ReactNode;
  columnListContentClassName?: (column: BoardItem) => string;
  renderListFooter?: (column: BoardItem) => React.ReactNode;
  renderColumnAdder?: (column: BoardItem) => React.ReactNode;
  items: BoardItem[];
  cardWrapperStyle?: (
    card: BoardItem,
    column: BoardItem
  ) => React.CSSProperties;
  cardWrapperClassName?: string;
  onScroll?: (e: ScrollEvent, column: BoardItem) => void;
}

const Column = (props: Props) => {
  const {
    index,
    data,
    items,
    onColumnClick,
    renderColumnHeader,
    renderColumnWrapper,
    renderColumnFooter,
    columnWrapperStyle,
    columnHeaderStyle,
    onColumnDndStateChange,
    columnWrapperClassName,
    columnHeaderClassName,
    columnListContentClassName,
    columnClassName,
    columnStyle,
    renderColumnAdder,
    ...rest
  } = props;

  const {
    headerRef,
    outerFullHeightRef,
    innerRef,
    state,
    cardOverShadowCount,
  } = useColumnDnd(data, index, items, onColumnDndStateChange);

  const containerClassName = classNames(
    withPrefix("column-outer"),
    columnWrapperClassName
  );

  const ColumnWrapper = (children: React.ReactNode) =>
    renderColumnWrapper ? (
      renderColumnWrapper(data, {
        children,
        className: containerClassName,
        style: columnWrapperStyle?.(data),
        ref: outerFullHeightRef,
      })
    ) : (
      <div
        className={containerClassName}
        ref={outerFullHeightRef}
        style={columnWrapperStyle?.(data)}
      >
        {children}
      </div>
    );

  return (
    <div onClick={(e) => onColumnClick?.(e, data)}>
      {ColumnWrapper(
        <div
          className={classNames(withPrefix("column"), columnClassName?.(data))}
          ref={innerRef}
          style={columnStyle?.(data)}
        >
          <div className={withPrefix("column-wrapper")}>
            <ColumnHeader
              renderColumnHeader={renderColumnHeader}
              columnHeaderStyle={columnHeaderStyle}
              columnHeaderClassName={columnHeaderClassName?.(data)}
              data={data}
              ref={headerRef}
            />
            <ColumnContent
              items={items}
              column={data}
              columnListContentClassName={columnListContentClassName?.(data)}
              cardOverHeight={
                cardOverShadowCount ? (state as any).dragging.height : null
              }
              cardOverShadowCount={cardOverShadowCount}
              {...rest}
            />
            {renderColumnFooter?.(data)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
