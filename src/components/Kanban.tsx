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
import { getSharedProps } from "@/utils/getSharedProps";
import ColumnAdder from "./ColumnAdder";

const Kanban = forwardRef<HTMLDivElement, BoardProps>((props, ref) => {
  const {
    dataSource,
    rootStyle = {},
    rootClassName,
    onColumnMove,
    onCardMove,
    renderColumnWrapper,
    renderColumnAdder,
    ...rest
  } = props;

  const columns = getColumnsFromDataSource(dataSource);
  const internalRef = useRef<HTMLDivElement>(null);

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
    <KanbanProvider {...getSharedProps(props)}>
      <div
        ref={mergeRefs(ref, internalRef)}
        className={containerClassName}
        style={rootStyle}
      >
        {columns?.map((column, index) => (
          <Column
            key={column.id}
            index={index}
            data={column}
            items={getColumnChildren(column, dataSource)}
            renderColumnWrapper={renderColumnWrapper}
            {...rest}
          />
        ))}
        <ColumnAdder renderColumnAdder={renderColumnAdder} />
      </div>
    </KanbanProvider>
  );
});

export default Kanban;
