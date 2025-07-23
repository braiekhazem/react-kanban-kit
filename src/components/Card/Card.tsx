import { withPrefix } from "@/utils/getPrefix";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BoardItem } from "../types";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
  Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { createPortal } from "react-dom";

type TaskCardState =
  | {
      type: "idle";
    }
  | {
      type: "is-dragging";
    }
  | {
      type: "is-dragging-and-left-self";
    }
  | {
      type: "is-over";
      dragging: DOMRect;
      closestEdge: Edge;
    }
  | {
      type: "preview";
      container: HTMLElement;
      dragging: DOMRect;
    };

const idle: TaskCardState = { type: "idle" };

export const CardShadow = memo(({ height }: { height: number }) => {
  return (
    <div
      className={withPrefix("card-shadow")}
      style={{ height: `${height}px` }}
    />
  );
});

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
      {showTopShadow && <CardShadow height={shadowHeight} />}
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
      {showBottomShadow && <CardShadow height={shadowHeight} />}
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
}

const Card = (props: Props) => {
  const { render, data, column, index, isDraggable, onClick, cardsGap } = props;
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<TaskCardState>(idle);

  // Memoize initial data to prevent recreating on each render
  const getInitialData = () => ({
    type: "card",
    itemId: data.id,
    columnId: column.id,
    index,
    isDraggable,
    parentId: data.parentId,
    rect: innerRef.current?.getBoundingClientRect() || null,
  });

  const getDropTargetData = ({ input, element }) => {
    const cardData = {
      type: "card",
      "card-drop-target": true,
      itemId: data.id,
      columnId: column.id,
      index,
      isDraggable,
      parentId: data.parentId,
    };

    return attachClosestEdge(cardData, {
      input,
      element,
      allowedEdges: ["top", "bottom"],
    });
  };

  // Optimize the drop check to avoid recalculating on every drag move
  const canDrop = useCallback(
    (args) => {
      const sourceData = args.source.data;
      if (sourceData.itemId === data.parentId) return false;

      return sourceData.isDraggable;
    },
    [data.id, data.parentId]
  );

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;

    if (!outer || !inner) return;

    return combine(
      draggable({
        element: inner,
        getInitialData,
        onGenerateDragPreview({ nativeSetDragImage, location }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: inner,
              input: location.current.input,
            }),
            render({ container }) {
              const rect = inner.getBoundingClientRect();
              setState({
                type: "preview",
                container,
                dragging: rect,
              });
            },
          });
        },
        onDragStart() {
          setState({ type: "is-dragging" });
        },
        onDrop() {
          setState(idle);
        },
        canDrag: () => isDraggable,
      }),
      dropTargetForElements({
        element: outer,
        canDrop,
        getIsSticky: () => true,
        getData: getDropTargetData,
        onDragEnter({ source, self }) {
          if (source.data.type !== "card") return;
          if (source.data.itemId === data.id) return;

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) return;

          setState({
            type: "is-over",
            dragging: source.data.rect as DOMRect,
            closestEdge,
          });
        },
        onDrag({ source, self }) {
          if (source.data.type !== "card") return;
          if (source.data.itemId === data.id) return;

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) return;

          setState({
            type: "is-over",
            dragging: source.data.rect as DOMRect,
            closestEdge,
          });
        },

        onDragLeave({ source }) {
          if (source.data.type !== "card") return;

          if (source.data.itemId === data.id) {
            setState({ type: "is-dragging-and-left-self" });
            return;
          }

          setState(idle);
        },
        onDrop() {
          setState(idle);
        },
      })
    );
  }, [
    data,
    column,
    index,
    isDraggable,
    getInitialData,
    getDropTargetData,
    canDrop,
  ]);

  //   console.log({ state, outerRef, innerRef });

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
      />

      {state.type === "preview"
        ? createPortal(
            <CardDisplay
              state={state}
              data={data}
              column={column}
              index={index}
              isDraggable={isDraggable}
              render={render}
            />,
            state.container
          )
        : null}
    </>
  );
};

export default Card;
