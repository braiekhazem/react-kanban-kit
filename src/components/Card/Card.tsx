import { withPrefix } from "@/utils/getPrefix";
import React, { memo, useEffect, useMemo, useState } from "react";
import { BoardItem, DndState } from "../types";
import { createPortal } from "react-dom";
import { TaskCardState, useCardDnd } from "@/global/dnd/useCardDnd";

export const CardShadow = memo(
  ({
    height,
    customIndicator,
  }: {
    height: number;
    customIndicator?: React.ReactNode;
  }) => {
    return (
      <div className={withPrefix("card-shadow-container")}>
        {customIndicator || (
          <div
            className={withPrefix("card-shadow")}
            style={{ height: `${height}px` }}
          />
        )}
      </div>
    );
  }
);

const CardDisplay = (props: {
  outerRef?: React.RefObject<HTMLDivElement>;
  innerRef?: React.RefObject<HTMLDivElement>;
  state: TaskCardState;
  data: BoardItem;
  column: BoardItem;
  index: number;
  isDraggable: boolean;
  render: (props: {
    data: BoardItem;
    column: BoardItem;
    index: number;
    isDraggable: boolean;
  }) => React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
  cardsGap?: number;
  renderCardDragIndicator?: (card: BoardItem, info: any) => React.ReactNode;
}) => {
  const {
    outerRef,
    innerRef,
    state,
    data,
    column,
    index,
    isDraggable,
    cardsGap,
    render,
    onClick,
    renderCardDragIndicator,
  } = props;

  const containerStyle = useMemo(() => {
    const styles: React.CSSProperties = {};
    if (state.type === "is-dragging-and-left-self") {
      styles.display = "none";
    }
    return styles;
  }, [state.type]);

  const innerStyle = useMemo(() => {
    if (state.type === "is-dragging") {
      return { opacity: 0.6 };
    }
    if (state.type === "preview") {
      return {
        width: state.dragging.width,
        height: state.dragging.height,
        transform: "rotate(4deg)",
      };
    }
    return {};
  }, [state]);

  const showTopShadow = state.type === "is-over" && state.closestEdge === "top";
  const showBottomShadow =
    state.type === "is-over" && state.closestEdge === "bottom";
  const shadowHeight = state.type === "is-over" ? state.dragging.height : 0;
  const renderContent = render({ data, column, index, isDraggable });
  const customIndicator = renderCardDragIndicator?.(
    state.type === "is-dragging" ? data : null,
    {
      height: shadowHeight,
    }
  );

  return (
    <div
      ref={outerRef}
      className={withPrefix("card-outer")}
      onClick={(e) => onClick?.(e, data)}
      style={{
        ...containerStyle,
        ...(cardsGap !== undefined ? { marginBottom: cardsGap } : {}),
      }}
      data-test-id={data.id}
      data-rkk-column={column.id}
      data-rkk-index={index}
    >
      {showTopShadow && (
        <CardShadow height={shadowHeight} customIndicator={customIndicator} />
      )}
      <div
        ref={innerRef}
        className={withPrefix("card-inner")}
        style={{
          ...innerStyle,
          marginBottom: showBottomShadow ? 6 : 0,
          marginTop: showTopShadow ? 6 : 0,
        }}
      >
        {renderContent}
      </div>
      {showBottomShadow && (
        <CardShadow height={shadowHeight} customIndicator={customIndicator} />
      )}
    </div>
  );
};

interface Props {
  render: (props: {
    data: BoardItem;
    column: BoardItem;
    index: number;
    isDraggable: boolean;
  }) => React.ReactNode;
  data: BoardItem;
  column: BoardItem;
  index: number;
  isDraggable: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
  cardsGap?: number;
  onCardDndStateChange?: (info: DndState) => void;
  renderCardDragIndicator?: (card: BoardItem, info: any) => React.ReactNode;
  renderCardDragPreview?: (card: BoardItem, info: any) => React.ReactNode;
}

const Card = (props: Props) => {
  const {
    render,
    data,
    column,
    index,
    isDraggable,
    cardsGap,
    onClick,
    onCardDndStateChange,
    renderCardDragIndicator,
    renderCardDragPreview,
  } = props;
  const { outerRef, innerRef, state } = useCardDnd(
    data,
    column,
    index,
    isDraggable,
    onCardDndStateChange
  );

  return (
    <>
      <CardDisplay
        outerRef={outerRef}
        innerRef={innerRef}
        state={state}
        data={data}
        column={column}
        index={index}
        isDraggable={isDraggable}
        render={render}
        onClick={onClick}
        cardsGap={cardsGap}
        renderCardDragIndicator={renderCardDragIndicator}
      />

      {state.type === "preview"
        ? createPortal(
            renderCardDragPreview?.(data, {
              state,
              data,
              column,
              index,
              isDraggable,
            }) || (
              <CardDisplay
                state={state}
                data={data}
                column={column}
                index={index}
                isDraggable={isDraggable}
                render={render}
              />
            ),
            state.container
          )
        : null}
    </>
  );
};

export default Card;
