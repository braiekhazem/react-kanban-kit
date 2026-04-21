import { useCallback, useEffect, useRef, useState } from "react";
import { BoardItem, DndState } from "@/components/types";
import { withPrefix } from "@/utils/getPrefix";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { useKanbanContext } from "@/context/KanbanContext";

// ── Column DnD State ──────────────────────────────────────────────────

export type TColumnState =
  | { type: "idle" }
  | { type: "is-dragging" }
  | { type: "is-dragging-and-left-self" }
  | { type: "is-card-over"; isOverChildCard: boolean; dragging: DOMRect }
  | { type: "is-column-over"; closestEdge: Edge; rect: DOMRect }
  | { type: "preview"; container: HTMLElement; dragging: DOMRect };

const isCardData = (data: any) => data.type === "card";
const isColumnData = (data: any) => data.type === "column";
const idle: TColumnState = { type: "idle" };

export const useColumnDnd = (
  data: BoardItem,
  index: number,
  items: BoardItem[],
  onColumnDndStateChange?: (info: DndState) => void,
  allowColumnDrag?: boolean,
  hasCustomPreview?: boolean,
) => {
  const { viewOnly } = useKanbanContext();
  const isColumnDraggable =
    !viewOnly && allowColumnDrag !== false && data.isDraggable !== false;

  const headerRef = useRef<HTMLDivElement>(null);
  const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TColumnState>(idle);

  const cardOverShadowCount =
    state.type === "is-card-over" && !state.isOverChildCard ? 1 : 0;
  const totalTasksCount = data.totalChildrenCount + cardOverShadowCount;

  const setIsCardOver = useCallback(
    ({ data, location }: { data: any; location: any }) => {
      const innerMost = location.current.dropTargets[0];
      const isOverChildCard = Boolean(innerMost?.data["card-drop-target"]);

      const proposed: TColumnState = {
        type: "is-card-over",
        dragging: data.rect,
        isOverChildCard,
      };

      setState((current) => {
        if (
          current.type === proposed.type &&
          current.isOverChildCard === proposed.isOverChildCard &&
          current.dragging === proposed.dragging
        ) {
          return current;
        }
        return proposed;
      });
    },
    [],
  );

  useEffect(() => {
    const outer = outerFullHeightRef.current;
    const inner = innerRef.current;
    const header = headerRef.current;
    if (!outer || !inner || !header) return;

    const scroller = outer.querySelector(
      `.${withPrefix("column-content-list")}`,
    );

    const columnData = {
      type: "column",
      columnId: data.id,
      column: data,
      index,
    };

    return combine(
      draggable({
        element: header,
        getInitialData: () => columnData,
        canDrag: () => isColumnDraggable,

        onGenerateDragPreview({ location, nativeSetDragImage }) {
          const rect = outer.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: outer,
              input: location.current.input,
            }),
            render({ container }) {
              if (hasCustomPreview) {
                setState({ type: "preview", container, dragging: rect });
              } else {
                const clone = outer.cloneNode(true) as HTMLElement;
                clone.style.width = `${rect.width}px`;
                clone.style.height = `${rect.height}px`;
                clone.style.transform = "rotate(4deg)";
                clone.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                container.appendChild(clone);
              }
            },
          });
        },

        onDragStart() {
          setState({ type: "is-dragging" });
        },

        onDrop() {
          setState(idle);
        },
      }),

      dropTargetForElements({
        element: outer,

        getData({ input, element }) {
          return attachClosestEdge(columnData, {
            input,
            element,
            allowedEdges: ["left", "right"],
          });
        },

        canDrop({ source }) {
          return isCardData(source.data) || isColumnData(source.data);
        },

        getIsSticky: () => true,

        onDragStart({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
          }
        },

        onDragEnter({ source, location, self }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
            return;
          }
          if (isColumnData(source.data) && source.data.columnId !== data.id) {
            const closestEdge = extractClosestEdge(self.data);
            if (!closestEdge) return;
            const rect = outer.getBoundingClientRect();
            setState({ type: "is-column-over", closestEdge, rect });
          }
        },

        onDrag({ source, self }) {
          if (!isColumnData(source.data)) return;
          if (source.data.columnId === data.id) return;

          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) return;

          setState((current) => {
            if (
              current.type === "is-column-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            const rect = outer.getBoundingClientRect();
            return { type: "is-column-over", closestEdge, rect };
          });
        },

        onDropTargetChange({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
          }
        },

        onDragLeave({ source }) {
          if (isColumnData(source.data) && source.data.columnId === data.id) {
            setState({ type: "is-dragging-and-left-self" });
            return;
          }
          setState(idle);
        },

        onDrop() {
          setState(idle);
        },
      }),

      autoScrollForElements({
        canScroll({ source }) {
          return isCardData(source.data);
        },
        getConfiguration: () => ({ maxScrollSpeed: "standard" as const }),
        element: scroller,
      }),
    );
  }, [data, index, items?.length, isColumnDraggable, hasCustomPreview]);

  useEffect(() => {
    onColumnDndStateChange?.({ state, column: data });
  }, [state, onColumnDndStateChange]);

  return {
    headerRef,
    outerFullHeightRef,
    innerRef,
    state,
    cardOverShadowCount,
    totalTasksCount,
  };
};
