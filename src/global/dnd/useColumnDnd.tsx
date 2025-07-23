import { useCallback, useEffect, useRef, useState } from "react";
import { BoardItem } from "@/components/types";
import { withPrefix } from "@/utils/getPrefix";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

export type TColumnState =
  | {
      type: "is-card-over";
      isOverChildCard: boolean;
      dragging: DOMRect;
    }
  | {
      type: "is-column-over";
    }
  | {
      type: "idle";
    }
  | {
      type: "is-dragging";
    };

const isCardData = (data: any) => {
  return data.type === "card";
};

const isColumnData = (data: any) => {
  return data.type === "column";
};

const idle = { type: "idle" } as TColumnState;

export const useColumnDnd = (
  data: BoardItem,
  index: number,
  items: BoardItem[]
) => {
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

      setState(proposed);
    },
    []
  );

  const handleGenerateDragPreview = useCallback(
    ({ location, nativeSetDragImage }) => {
      setCustomNativeDragPreview({
        nativeSetDragImage,
        getOffset: preserveOffsetOnSource({
          element: headerRef.current!,
          input: location.current.input,
        }),
        render({ container }) {
          const rect = innerRef.current!.getBoundingClientRect();
          const preview = innerRef.current!.cloneNode(true) as HTMLElement;
          if (!preview) return;

          preview.style.width = `${rect.width}px`;
          preview.style.height = `${rect.height}px`;
          preview.style.transform = "rotate(4deg)";

          container.appendChild(preview);
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
    ({ source, location }) => {
      if (isCardData(source.data)) {
        setIsCardOver({ data: source.data, location });
        return;
      }
      if (isColumnData(source.data) && source.data.columnId !== data.id) {
        setState({ type: "is-column-over" });
      }
    },
    [data.id, setIsCardOver]
  );

  const handleDropTargetChange = useCallback(
    ({ source, location }) => {
      if (isCardData(source.data)) {
        setIsCardOver({ data: source.data, location });
        return;
      }
    },
    [setIsCardOver]
  );

  const handleDragLeave = useCallback(
    ({ source }) => {
      if (isColumnData(source.data) && source.data.columnId === data.id) {
        return;
      }
      setState(idle);
    },
    [data.id]
  );

  const canDrop = useCallback(({ source }) => {
    return source.data.type === "card" || source.data.type === "column";
  }, []);

  const canScroll = useCallback(({ source }) => {
    return source.data.type === "card";
  }, []);

  const getConfiguration = useCallback(() => {
    return {
      maxScrollSpeed: "standard" as const,
    };
  }, []);

  useEffect(() => {
    if (
      !outerFullHeightRef.current ||
      !innerRef.current ||
      !headerRef.current
    ) {
      console.log("not ready");
      return;
    }

    const scroller = outerFullHeightRef.current.querySelector(
      `.${withPrefix("column-content-list")}`
    );

    console.log({ outerFullHeightRef, innerRef, headerRef, scroller });

    const columnData = {
      type: "column",
      columnId: data.id,
      column: data,
      index,
    };

    return combine(
      draggable({
        element: headerRef.current,
        getInitialData: () => columnData,
        onGenerateDragPreview: handleGenerateDragPreview,
        onDragStart: handleDragStart,
        onDrop: handleDrop,
      }),
      dropTargetForElements({
        element: outerFullHeightRef.current,
        getData: () => columnData,
        canDrop,
        getIsSticky: () => true,
        onDragStart: ({ source, location }) => {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
          }
        },
        onDragEnter: handleDragEnter,
        onDropTargetChange: handleDropTargetChange,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
      }),
      autoScrollForElements({
        canScroll,
        getConfiguration,
        element: scroller,
      })
    );
  }, [
    data,
    index,
    items?.length,
    handleGenerateDragPreview,
    handleDragStart,
    handleDrop,
    canDrop,
    setIsCardOver,
    handleDragEnter,
    handleDropTargetChange,
    handleDragLeave,
    canScroll,
    getConfiguration,
  ]);

  return {
    headerRef,
    outerFullHeightRef,
    innerRef,
    state,
    cardOverShadowCount,
    totalTasksCount,
  };
};
