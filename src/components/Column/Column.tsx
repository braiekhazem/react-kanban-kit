import React, { memo, useMemo } from "react";
import { createPortal } from "react-dom";
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

const ColumnDropIndicator = memo(
  ({
    width,
    height,
    customIndicator,
  }: {
    width: number;
    height: number;
    customIndicator?: React.ReactNode;
  }) => (
    <div className={withPrefix("column-shadow-container")}>
      {customIndicator || (
        <div
          className={withPrefix("column-shadow")}
          style={{ width, height }}
        />
      )}
    </div>
  ),
);


interface Props {
  index: number;
  data: BoardItem;
  items: BoardItem[];
  configMap: ConfigMap;
  allowColumnDrag?: boolean;

  // Renderers
  renderColumnHeader?: (column: BoardItem) => React.ReactNode;
  renderColumnFooter?: (column: BoardItem) => React.ReactNode;
  renderColumnWrapper: (
    column: BoardItem,
    props: {
      children: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
      ref?: React.RefObject<HTMLDivElement>;
    },
  ) => React.ReactNode;
  renderSkeletonCard?: BoardProps["renderSkeletonCard"];
  renderListFooter?: (column: BoardItem) => React.ReactNode;
  renderColumnAdder?: (column: BoardItem) => React.ReactNode;
  renderGap?: (column: BoardItem) => React.ReactNode;

  // DnD renderers
  renderCardDragIndicator?: (card: BoardItem, info: any) => React.ReactNode;
  renderCardDragPreview?: (card: BoardItem, info: any) => React.ReactNode;
  renderColumnDragIndicator?: (
    column: BoardItem,
    info: { width: number; height: number; edge: "left" | "right" },
  ) => React.ReactNode;
  renderColumnDragPreview?: (column: BoardItem, info: any) => React.ReactNode;

  // Styling
  columnWrapperStyle?: (column: BoardItem) => React.CSSProperties;
  columnWrapperClassName?: (column: BoardItem) => string;
  columnHeaderStyle?: (column: BoardItem) => React.CSSProperties;
  columnHeaderClassName?: (column: BoardItem) => string;
  columnStyle?: (column: BoardItem) => React.CSSProperties;
  columnClassName?: (column: BoardItem) => string;
  columnListContentStyle?: (column: BoardItem) => React.CSSProperties;
  columnListContentClassName?: (column: BoardItem) => string;
  cardWrapperStyle?: (card: BoardItem, column: BoardItem) => React.CSSProperties;
  cardWrapperClassName?: string;

  onColumnClick?: (e: React.MouseEvent<HTMLDivElement>, column: BoardItem) => void;
  onCardClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
  onCardDndStateChange?: (info: DndState) => void;
  onColumnDndStateChange?: (info: DndState) => void;
  onScroll?: (e: ScrollEvent, column: BoardItem) => void;

  loadMore?: (columnId: string) => void;
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
    renderColumnDragPreview,
    renderColumnDragIndicator,
    allowColumnDrag,
    ...rest
  } = props;


  const {
    headerRef,
    outerFullHeightRef,
    innerRef,
    state,
    cardOverShadowCount,
  } = useColumnDnd(
    data,
    index,
    items,
    onColumnDndStateChange,
    allowColumnDrag,
    !!renderColumnDragPreview,
  );


  const isDragging = state.type === "is-dragging" || state.type === "preview";
  const isHidden = state.type === "is-dragging-and-left-self";
  const isColumnOver = state.type === "is-column-over";
  const closestEdge = isColumnOver ? state.closestEdge : null;


  const columnIndicator = useMemo(() => {
    if (!isColumnOver) return null;

    const { width, height } = state.rect;
    const edge = state.closestEdge === "left" ? "left" : "right";
    const custom = renderColumnDragIndicator?.(data, { width, height, edge });

    return (
      <ColumnDropIndicator
        width={width}
        height={height}
        customIndicator={custom}
      />
    );
  }, [isColumnOver, state, renderColumnDragIndicator, data]);


  const previewContent = useMemo(() => {
    if (state.type !== "preview" || !renderColumnDragPreview) return null;

    return renderColumnDragPreview(data, {
      state,
      data,
      index,
      isDraggable: data.isDraggable !== false,
    });
  }, [state, data, index, renderColumnDragPreview]);


  const containerClassName = classNames(
    withPrefix("column-outer"),
    columnWrapperClassName?.(data),
  );

  const columnWrapperContent = (children: React.ReactNode) =>
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


  const dragStyle = isHidden
    ? { display: "none" as const }
    : isDragging
      ? { opacity: 0.4 }
      : undefined;


  return (
    <>
      {closestEdge === "left" && columnIndicator}

      <div onClick={(e) => onColumnClick?.(e, data)} style={dragStyle}>
        {columnWrapperContent(
          <div
            className={classNames(
              withPrefix("column"),
              columnClassName?.(data),
            )}
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
          </div>,
        )}

        {state.type === "preview" &&
          previewContent &&
          createPortal(previewContent, state.container)}
      </div>

      {closestEdge === "right" && columnIndicator}
    </>
  );
};

export default Column;
