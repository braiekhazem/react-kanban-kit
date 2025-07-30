import { withPrefix } from "@/utils/getPrefix";
import React, { forwardRef, useRef } from "react";
import { BoardItem } from "../types";
import classNames from "classnames";

interface Props {
  renderColumnHeader?: (column: BoardItem) => React.ReactNode;
  columnHeaderStyle?: (column: BoardItem) => React.CSSProperties;
  columnHeaderClassName?: string;
  data: BoardItem;
}

const ColumnHeader = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    renderColumnHeader,
    columnHeaderStyle,
    columnHeaderClassName = "",
    data,
  } = props;

  const headerClassName = classNames(
    withPrefix("column-header"),
    columnHeaderClassName
  );

  if (renderColumnHeader)
    return <div ref={ref}>{renderColumnHeader(data)}</div>;

  return (
    <header
      ref={ref}
      className={headerClassName}
      style={columnHeaderStyle?.(data)}
    >
      <div className={withPrefix("column-header-left")}>{data?.title}</div>
      <div className={withPrefix("column-header-right")}>
        {data?.totalItemsCount || data?.totalChildrenCount || 0}
      </div>
    </header>
  );
});

export default ColumnHeader;
