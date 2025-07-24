import { BoardProps } from "./types";
import {
  getColumnChildren,
  getColumnsFromDataSource,
} from "@/utils/columnsUtils";
import { withPrefix } from "@/utils/getPrefix";
import classNames from "classnames";
import { Column } from "./Column";
import { forwardRef, useEffect, useRef } from "react";
import { autoScroller } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-autoscroll";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { KanbanProvider } from "@/context/KanbanContext";
import mergeRefs from "@/utils/mergeRefs";
import { handleCardDrop } from "@/global/dnd/dropManager";

const Kanban = forwardRef<HTMLDivElement, BoardProps>((props, ref) => {
  const {
    dataSource,
    configMap,
    renderColumnHeader,
    renderColumnWrapper,
    columnWrapperStyle,
    columnHeaderStyle,
    columnWrapperClassName,
    columnHeaderClassName,
    columnListContentStyle,
    columnListContentClassName,
    rootStyle = {},
    rootClassName,
    onScroll,
    onColumnMove,
    onCardMove,
    onColumnClick,
    onCardClick,
    renderColumnFooter,
    renderSkeletonCard,
    loadMore,
    virtualization,
    cardWrapperStyle,
    cardWrapperClassName,
    cardsGap,
    onCardDndStateChange,
    onColumnDndStateChange,
    renderCardDragIndicator,
    renderCardDragPreview,
    columnClassName,
    columnStyle,
  } = props;

  const columns = getColumnsFromDataSource(dataSource);
  const internalRef = useRef<HTMLDivElement>(null);
  console.log({ dataSource, configMap, columns });

  useEffect(() => {
    if (!internalRef.current) return;

    return combine(
      monitorForElements({
        onDragStart({ location }) {
          autoScroller.start({ input: location.current.input });
        },
        onDrag({ location }) {
          autoScroller.updateInput({ input: location.current.input });
        },
        onDrop(args) {
          autoScroller.stop();
          handleCardDrop({
            source: {
              id: (args.source as any).id || "",
              data: args.source.data,
            },
            location: {
              current: {
                dropTargets: args.location.current.dropTargets,
              },
            },
            columns,
            dataSource,
            onCardMove,
            onColumnMove,
          });
        },
      }),
      autoScrollForElements({
        element: internalRef.current,
        canScroll: () => true,
        getConfiguration: () => ({
          maxScrollSpeed: "standard",
        }),
      })
    );
  }, [columns, dataSource, onCardMove, onColumnMove]);

  const containerClassName = classNames(withPrefix("board"), rootClassName);

  return (
    <KanbanProvider {...props}>
      <div
        ref={mergeRefs(ref, internalRef)}
        className={containerClassName}
        style={rootStyle}
      >
        {columns?.map((column, index) => (
          <Column
            key={column.id || index}
            index={index}
            data={column}
            configMap={configMap}
            loadMore={loadMore}
            items={getColumnChildren(column, dataSource)}
            onColumnClick={onColumnClick}
            onCardClick={onCardClick}
            renderColumnHeader={renderColumnHeader}
            renderColumnFooter={renderColumnFooter}
            renderSkeletonCard={renderSkeletonCard}
            renderColumnWrapper={renderColumnWrapper}
            columnWrapperStyle={columnWrapperStyle}
            columnHeaderStyle={columnHeaderStyle}
            columnClassName={columnClassName}
            columnStyle={columnStyle}
            onCardDndStateChange={onCardDndStateChange}
            onColumnDndStateChange={onColumnDndStateChange}
            columnWrapperClassName={columnWrapperClassName}
            columnHeaderClassName={columnHeaderClassName}
            columnListContentStyle={columnListContentStyle}
            renderCardDragIndicator={renderCardDragIndicator}
            renderCardDragPreview={renderCardDragPreview}
            columnListContentClassName={columnListContentClassName}
            virtualization={virtualization}
            cardWrapperStyle={cardWrapperStyle}
            cardWrapperClassName={cardWrapperClassName}
            cardsGap={cardsGap}
            onScroll={onScroll}
          />
        ))}
      </div>
    </KanbanProvider>
  );
});

export default Kanban;
