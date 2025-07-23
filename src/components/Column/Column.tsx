import React, { Fragment, useEffect, useRef, useState } from "react";
import { BoardItem, BoardProps, ConfigMap, ScrollEvent } from "../types";
import { withPrefix } from "@/utils/getPrefix";
import classNames from "classnames";
import ColumnHeader from "../ColumnHeader";
import ColumnContent from "../ColumnContent";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

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

const isCardData = (data: any) => {
  return data.type === "card";
};

const isColumnData = (data: any) => {
  return data.type === "column";
};

const idle = { type: "idle" } as TColumnState;

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
  columnWrapperClassName?: string;
  columnHeaderClassName?: string;
  columnListContentStyle?: (column: BoardItem) => React.CSSProperties;
  columnListContentClassName?: string;
  virtualization?: boolean;
  items: BoardItem[];
  cardWrapperStyle?: (
    card: BoardItem,
    column: BoardItem
  ) => React.CSSProperties;
  cardWrapperClassName?: string;
  cardsGap?: number;
  onScroll?: (e: ScrollEvent, column: BoardItem) => void;
}

const Column = (props: Props) => {
  const {
    index,
    data,
    loadMore,
    items,
    configMap,
    onColumnClick,
    onCardClick,
    renderColumnHeader,
    renderColumnWrapper,
    renderColumnFooter,
    renderSkeletonCard,
    columnWrapperStyle,
    columnHeaderStyle,
    columnWrapperClassName,
    columnHeaderClassName,
    columnListContentStyle,
    columnListContentClassName,
    virtualization,
    cardWrapperStyle,
    cardWrapperClassName,
    onScroll,
    cardsGap,
  } = props;

  const headerRef = useRef<HTMLDivElement>(null);
  const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TColumnState>(idle);

  const cardOverShadowCount =
    state.type === "is-card-over" && !state.isOverChildCard ? 1 : 0;
  const totalTasksCount = data.totalChildrenCount + cardOverShadowCount;

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

  const containerClassName = classNames(
    withPrefix("column-outer"),
    columnWrapperClassName
  );

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
        getData: () => columnData,
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
          if (isColumnData(source.data) && source.data.columnId !== data.id) {
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
          if (isColumnData(source.data) && source.data.columnId === data.id) {
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
  }, [data, index, items?.length]);

  console.log({ state });

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
        <div className={withPrefix("column")} ref={innerRef}>
          <div className={withPrefix("column-wrapper")}>
            <ColumnHeader
              renderColumnHeader={renderColumnHeader}
              columnHeaderStyle={columnHeaderStyle}
              columnHeaderClassName={columnHeaderClassName}
              data={data}
              ref={headerRef}
            />
            <ColumnContent
              items={items}
              column={data}
              columnListContentStyle={columnListContentStyle}
              columnListContentClassName={columnListContentClassName}
              cardWrapperStyle={cardWrapperStyle}
              cardWrapperClassName={cardWrapperClassName}
              cardsGap={cardsGap}
              configMap={configMap}
              virtualization={virtualization ?? true}
              renderSkeletonCard={renderSkeletonCard}
              onScroll={onScroll}
              onCardClick={onCardClick}
              loadMore={loadMore}
            />
            {renderColumnFooter?.(data)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
