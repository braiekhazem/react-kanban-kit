import { memo, useEffect, useRef, useState, useMemo, useCallback } from "react";
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
import { BoardItem } from "../types";

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
  return <div className="card-shadow" style={{ height: `${height}px` }} />;
});

export const CardDisplay = memo(
  ({
    task,
    state,
    outerRef,
    innerRef,
    renderCard,
    isSubtask,
    hasSubtasks,
    depth,
  }: {
    task: BoardItem;
    state: TaskCardState;
    outerRef?: React.MutableRefObject<HTMLDivElement | null>;
    innerRef?: React.MutableRefObject<HTMLDivElement | null>;
    renderCard: (
      item: BoardItem,
      options: { isSubtask: boolean; hasSubtasks: boolean; depth?: number }
    ) => React.ReactNode;
    isSubtask: boolean;
    hasSubtasks: boolean;
    depth?: number;
  }) => {
    // Pre-compute styles to avoid recalculations
    const containerStyle = useMemo(() => {
      const styles: React.CSSProperties = {
        paddingLeft: depth ? depth * 20 : 0,
      };
      if (state.type === "is-dragging-and-left-self") {
        styles.display = "none";
      }
      return styles;
    }, [depth, state.type]);

    const innerStyle = useMemo(() => {
      if (state.type === "is-dragging") {
        return { opacity: 0.6 };
      }
      if (state.type === "preview") {
        return {
          width: state.dragging.width,
          height: state.dragging.height,
          // transform: !isSafari() ? 'rotate(4deg)' : undefined,
        };
      }
      return {};
    }, [state]);

    // Avoid conditional rendering for better performance
    const showTopShadow =
      state.type === "is-over" && state.closestEdge === "top";
    const showBottomShadow =
      state.type === "is-over" && state.closestEdge === "bottom";
    const shadowHeight = state.type === "is-over" ? state.dragging.height : 0;

    return (
      <div
        ref={outerRef}
        className="task-card-container"
        style={containerStyle}
      >
        {showTopShadow && <CardShadow height={shadowHeight} />}

        <div
          ref={innerRef}
          className={`task-card-draggable ${isSubtask ? "is-subtask" : ""}`}
          style={innerStyle}
        >
          {renderCard(task, { isSubtask, hasSubtasks, depth })}
        </div>

        {showBottomShadow && <CardShadow height={shadowHeight} />}
      </div>
    );
  }
);

interface TaskCardProps {
  task: BoardItem;
  renderCard: (
    item: BoardItem,
    options: { isSubtask: boolean; hasSubtasks: boolean; depth?: number }
  ) => React.ReactNode;
  index: number;
  style?: React.CSSProperties;
  setSize?: (index: number, size: number) => void;
  columnId: string;
  isSubtask?: boolean;
  depth?: number;
}

const TaskCard = memo(
  ({
    task,
    renderCard,
    index,
    columnId,
    isSubtask = false,
    depth = 0,
  }: TaskCardProps) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<TaskCardState>(idle);
    const hasSubtasks = Boolean(task.subtasks?.length);

    // Memoize initial data to prevent recreating on each render
    const getInitialData = () => ({
      type: "card",
      itemId: task.id,
      columnId,
      index,
      isSubtask,
      parentId: task.parentId,
      rect: innerRef.current?.getBoundingClientRect() || null,
    });

    const getDropTargetData = ({ input, element }) => {
      const data = {
        type: "card",
        "card-drop-target": true,
        itemId: task.id,
        columnId,
        index,
        isSubtask,
        parentId: task.parentId,
      };

      return attachClosestEdge(data, {
        input,
        element,
        allowedEdges: ["top", "bottom"],
      });
    };

    // Optimize the drop check to avoid recalculating on every drag move
    const canDrop = useCallback(
      (args) => {
        const sourceData = args.source.data;

        if (isSubtask) return false;
        if (sourceData.itemId === task.parentId) return false;
        if (sourceData.isSubtask) return false;

        return sourceData.type === "card";
      },
      [isSubtask, task.id, task.parentId]
    );

    useEffect(() => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      // console.log({ outer, inner });

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
            console.log("drag start");
            setState({ type: "is-dragging" });
          },
          onDrop() {
            setState(idle);
          },
          canDrag: () => !isSubtask,
        }),
        dropTargetForElements({
          element: outer,
          canDrop,
          getIsSticky: () => true,
          getData: getDropTargetData,
          onDragEnter({ source, self }) {
            if (source.data.type !== "card") return;
            console.log("drag enter ", source.data.itemId, task.id);
            if (source.data.itemId === task.id) return;

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
            if (source.data.itemId === task.id) return;

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

            if (source.data.itemId === task.id) {
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
      task,
      columnId,
      index,
      isSubtask,
      getInitialData,
      getDropTargetData,
      canDrop,
    ]);

    return (
      <>
        <CardDisplay
          outerRef={outerRef}
          innerRef={innerRef}
          state={state}
          task={task}
          renderCard={renderCard}
          isSubtask={isSubtask}
          hasSubtasks={hasSubtasks}
          depth={depth}
        />

        {state.type === "preview"
          ? createPortal(
              <CardDisplay
                state={state}
                task={task}
                renderCard={renderCard}
                isSubtask={isSubtask}
                hasSubtasks={hasSubtasks}
                depth={0}
              />,
              state.container
            )
          : null}
      </>
    );
  }
);

export default TaskCard;
