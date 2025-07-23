import { useCallback, useEffect, useRef, useState } from "react";
import { BoardItem } from "@/components/types";
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

export type TaskCardState =
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

// Custom hook to handle all drag and drop logic
export const useCardDnd = (
  data: BoardItem,
  column: BoardItem,
  index: number,
  isDraggable: boolean
) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<TaskCardState>(idle);

  // Memoize initial data to prevent recreating on each render
  const getInitialData = useCallback(
    () => ({
      type: "card",
      itemId: data.id,
      columnId: column.id,
      index,
      isDraggable,
      parentId: data.parentId,
      rect: innerRef.current?.getBoundingClientRect() || null,
    }),
    [data.id, column.id, index, isDraggable, data.parentId]
  );

  const getDropTargetData = useCallback(
    ({ input, element }) => {
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
    },
    [data.id, column.id, index, isDraggable, data.parentId]
  );

  // Optimize the drop check to avoid recalculating on every drag move
  const canDrop = useCallback(
    (args) => {
      const sourceData = args.source.data;
      if (sourceData.itemId === data.parentId) return false;
      return sourceData.isDraggable;
    },
    [data.id, data.parentId]
  );

  // Drag and drop event handlers
  const handleGenerateDragPreview = useCallback(
    ({ nativeSetDragImage, location }) => {
      setCustomNativeDragPreview({
        nativeSetDragImage,
        getOffset: preserveOffsetOnSource({
          element: innerRef.current!,
          input: location.current.input,
        }),
        render({ container }) {
          const rect = innerRef.current!.getBoundingClientRect();
          setState({
            type: "preview",
            container,
            dragging: rect,
          });
        },
      });
    },
    []
  );

  const handleDragStart = useCallback(() => {
    setState({ type: "is-dragging" });
  }, []);

  const handleDrop = useCallback(() => {
    setState(idle);
  }, []);

  const handleDragEnter = useCallback(
    ({ source, self }) => {
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
    [data.id]
  );

  const handleDrag = useCallback(
    ({ source, self }) => {
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
    [data.id]
  );

  const handleDragLeave = useCallback(
    ({ source }) => {
      if (source.data.type !== "card") return;

      if (source.data.itemId === data.id) {
        setState({ type: "is-dragging-and-left-self" });
        return;
      }

      setState(idle);
    },
    [data.id]
  );

  // Setup drag and drop effects
  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;

    if (!outer || !inner) return;

    return combine(
      draggable({
        element: inner,
        getInitialData,
        onGenerateDragPreview: handleGenerateDragPreview,
        onDragStart: handleDragStart,
        onDrop: handleDrop,
        canDrag: () => isDraggable,
      }),
      dropTargetForElements({
        element: outer,
        canDrop,
        getIsSticky: () => true,
        getData: getDropTargetData,
        onDragEnter: handleDragEnter,
        onDrag: handleDrag,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
      })
    );
  }, [
    getInitialData,
    handleGenerateDragPreview,
    handleDragStart,
    handleDrop,
    isDraggable,
    canDrop,
    getDropTargetData,
    handleDragEnter,
    handleDrag,
    handleDragLeave,
  ]);

  return {
    outerRef,
    innerRef,
    state,
  };
};
