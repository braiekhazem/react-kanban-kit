import React, { useRef, useEffect, useState, memo } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { BoardItem } from "..";
import ItemRow from "../ItemRow";
import { VList } from "virtua";
import { createInfiniteScrollHandler } from "@src/utils/infinite-scroll";

type TColumnState =
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

interface BoardColumnProps {
  column: BoardItem;
  index: number;
  tasks: BoardItem[];
  virtualizedItemCount: number;
  renderCard: (item: BoardItem, options: any) => React.ReactNode;
  renderColumnHeader?: (column: BoardItem) => React.ReactNode;
  loadMore?: (columnId: string) => void;
  containerStyle?: React.CSSProperties;
  renderTaskAdder?: (
    column: BoardItem,
    parentItem: BoardItem,
    adder: BoardItem | any
  ) => React.ReactNode;
  renderFooterTasksList?: (column: BoardItem) => React.ReactNode;
  renderFooterColumn?: (column: BoardItem) => React.ReactNode;
  isCollapsed?: boolean;
  onColumnClick?: (column: BoardItem) => void;
  isExpanded?: boolean;
}

const isCardData = (data: any) => {
  return data.type === "card";
};

const isColumnData = (data: any) => {
  return data.type === "column";
};

const idle = { type: "idle" } as TColumnState;

const BoardColumn = memo(
  ({
    column,
    tasks,
    index,
    virtualizedItemCount,
    renderCard,
    loadMore,
    renderColumnHeader,
    containerStyle,
    renderTaskAdder,
    renderFooterTasksList,
    renderFooterColumn,
    isExpanded = true,
    onColumnClick,
  }: BoardColumnProps) => {
    const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const scrollableRef = useRef<HTMLDivElement | null>(null);
    const [state, setState] = useState<TColumnState>(idle);

    const cardOverShadowCount =
      state.type === "is-card-over" && !state.isOverChildCard ? 1 : 0;
    const totalTasksCount =
      virtualizedItemCount +
      (renderFooterTasksList ? 1 : 0) +
      cardOverShadowCount;

    function setIsCardOver({ data, location }: { data: any; location: any }) {
      const innerMost = location.current.dropTargets[0];
      const isOverChildCard = Boolean(innerMost?.data["card-drop-target"]);

      const proposed: TColumnState = {
        type: "is-card-over",
        dragging: data.rect,
        isOverChildCard,
      };

      setState(proposed);
    }

    const getPercentageOfLoadingData = () => {
      const percentage = (tasks.length / column?.totalChildrenCount) * 100;
      return Math.min(percentage, 100);
    };

    const threshold = Math.min(
      Math.max(getPercentageOfLoadingData() / 100, 0),
      1
    );

    const scrollHandler = createInfiniteScrollHandler({
      threshold,
      debounceMs: 200,
      onThresholdReached: () => loadMore?.(column.id),
    });

    const handleScroll = (offset) => {
      if (offset === 0 || !scrollableRef.current) return;
      const { scrollHeight, clientHeight } = scrollableRef.current;
      const syntheticEvent = {
        target: {
          scrollTop: offset,
          scrollHeight,
          clientHeight,
        },
      };

      scrollHandler(syntheticEvent);
    };

    useEffect(() => {
      if (
        !outerFullHeightRef.current ||
        !innerRef.current ||
        !headerRef.current ||
        !scrollableRef.current
      ) {
        return;
      }

      const scroller =
        outerFullHeightRef.current.querySelector(".board-column-list");

      const data = {
        type: "column",
        columnId: column.id,
        column,
        index,
      };

      return combine(
        draggable({
          element: headerRef.current,
          getInitialData: () => data,

          onGenerateDragPreview({ location, nativeSetDragImage }) {
            setCustomNativeDragPreview({
              nativeSetDragImage,
              getOffset: preserveOffsetOnSource({
                element: headerRef.current,
                input: location.current.input,
              }),
              render({ container }) {
                const rect = innerRef.current.getBoundingClientRect();
                const preview = innerRef.current.cloneNode(true) as HTMLElement;
                if (!preview) return;

                preview.style.width = `${rect.width}px`;
                preview.style.height = `${rect.height}px`;

                preview.style.transform = "rotate(4deg)";

                container.appendChild(preview);
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
          element: outerFullHeightRef.current,
          getData: () => data,
          canDrop({ source }) {
            return source.data.type === "card" || source.data.type === "column";
          },
          getIsSticky: () => true,
          onDragStart({ source, location }) {
            if (isCardData(source.data)) {
              setIsCardOver({ data: source.data, location });
            }
          },
          onDragEnter({ source, location }) {
            if (isCardData(source.data)) {
              setIsCardOver({ data: source.data, location });
              return;
            }
            if (
              isColumnData(source.data) &&
              source.data.columnId !== column.id
            ) {
              setState({ type: "is-column-over" });
            }
          },
          onDropTargetChange({ source, location }) {
            if (isCardData(source.data)) {
              setIsCardOver({ data: source.data, location });
              return;
            }
          },
          onDragLeave({ source }) {
            if (
              isColumnData(source.data) &&
              source.data.columnId === column.id
            ) {
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
            return source.data.type === "card";
          },
          getConfiguration() {
            return {
              maxScrollSpeed: "standard",
            };
          },

          element: scroller,
        })
      );
    }, [column, index, tasks.length]);

    return (
      <div
        className={`board-column-outer ${
          !isExpanded ? "board-column-outer-collapsed" : ""
        }`}
        ref={outerFullHeightRef}
        onClick={() => onColumnClick?.(column)}
        style={{
          backgroundColor:
            cardOverShadowCount && !isExpanded
              ? ((containerStyle.backgroundColor ||
                  containerStyle.background) as string)
              : "transparent",
        }}
      >
        <div
          ref={innerRef}
          className={`board-column ${
            state.type === "is-dragging" ? "is-dragging" : ""
          }`}
          style={{
            opacity: state.type === "is-dragging" ? 0.6 : 1,
            ...containerStyle,
          }}
        >
          <div
            className={`board-column-wrapper ${
              state.type === "is-column-over" ? "invisible" : ""
            }`}
          >
            <div ref={headerRef} className="board-column-header">
              {renderColumnHeader ? (
                renderColumnHeader(column)
              ) : (
                <div className="board-column-title">
                  {column?.title} <span>{column?.totalChildrenCount}</span>
                </div>
              )}
            </div>

            <div ref={scrollableRef} className={`board-column-content`}>
              <VList
                count={totalTasksCount}
                onScroll={handleScroll}
                className="board-column-list"
              >
                {(index) => {
                  const item = tasks[index];
                  return (
                    <ItemRow
                      key={item?.id || index}
                      index={index}
                      data={{
                        tasks,
                        renderCard,
                        isLoading: (index: number) => index >= tasks.length,
                        columnId: column.id,
                        renderTaskAdder: (parentItem: BoardItem) =>
                          renderTaskAdder?.(column, parentItem, item),
                        renderFooterTasksList: () =>
                          renderFooterTasksList?.(column),
                        isFooter: (index: number) =>
                          index === totalTasksCount - 1,
                        cardOver: cardOverShadowCount
                          ? {
                              height: (state as any).dragging.height,
                            }
                          : null,
                        isShadowCard: (index) => {
                          if (cardOverShadowCount)
                            return index === totalTasksCount - 2;
                          return false;
                        },
                      }}
                    />
                  );
                }}
              </VList>
            </div>

            {isExpanded && renderFooterColumn?.(column)}
          </div>
        </div>
      </div>
    );
  }
);

export default BoardColumn;
