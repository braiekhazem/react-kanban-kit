import { withPrefix } from "@/utils/getPrefix";
import React from "react";
import { BoardItem } from "../types";
import classNames from "classnames";

interface Props {
  renderColumnHeader?: (column: BoardItem) => React.ReactNode;
  columnHeaderStyle?: (column: BoardItem) => React.CSSProperties;
  columnHeaderClassName?: string;
  data: BoardItem;
}

const ColumnHeader = (props: Props) => {
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

  if (renderColumnHeader) return renderColumnHeader(data);

  return (
    <header className={headerClassName} style={columnHeaderStyle?.(data)}>
      <div className={withPrefix("column-header-left")}>{data?.title}</div>
      <div className={withPrefix("column-header-right")}>
        {data?.totalChildrenCount || 0}
      </div>
    </header>
  );
};

export default ColumnHeader;
