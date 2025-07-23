import { withPrefix } from "@/utils/getPrefix";
import React from "react";
import { BoardItem } from "../types";
import classNames from "classnames";
import { VList } from "virtua";

interface Props {
  items: BoardItem[];
  column: BoardItem;
  columnListContentStyle?: (column: BoardItem) => React.CSSProperties;
  columnListContentClassName?: string;
  headerHeight?: number;
}

const ColumnContent = (props: Props) => {
  const {
    items,
    column,
    columnListContentStyle,
    columnListContentClassName,
    headerHeight,
  } = props;

  console.log({ headerHeight });

  const containerClassName = classNames(
    withPrefix("column-content"),
    columnListContentClassName
  );

  return (
    <div
      className={containerClassName}
      style={{
        ...columnListContentStyle?.(column),
      }}
    >
      <VList
        count={column?.totalChildrenCount + 10}
        onScroll={() => {}}
        className={withPrefix("column-content-list")}
        style={{ height: "100%" }} // Ensure VList takes full height
      >
        {(index) => {
          const item = items[index];
          //   if (!item) return null; // Guard against undefined items
          return (
            <div
              key={(item?.id || 0) + index}
              style={{
                padding: "8px",
                margin: "4px 0",
                backgroundColor: "white",
                borderRadius: "4px",
              }}
            >
              {item?.title || `Item ${index}`}
            </div>
          );
        }}
      </VList>
    </div>
  );
};

export default ColumnContent;
