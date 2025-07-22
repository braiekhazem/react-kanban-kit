import React from "react";
import { BoardItem, ConfigMap } from "../types";
import { withPrefix } from "@/utils/getPrefix";
import classNames from "classnames";

interface Props {
  index: number;
  data: BoardItem;
  configMap: ConfigMap;
  loadMore?: (columnId: string) => void;
  onColumnClick?: (column: BoardItem) => void;
  onCardClick?: (card: BoardItem) => void;
  renderColumnHeader?: (column: BoardItem) => React.ReactNode;
  renderColumnWrapper: (
    column: BoardItem,
    {
      children,
      className,
      style,
    }: {
      children: React.ReactNode;
      className?: string;
      style?: React.CSSProperties;
    }
  ) => React.ReactNode;
  columnWrapperStyle?: (column: BoardItem) => React.CSSProperties;
  columnHeaderStyle?: (column: BoardItem) => React.CSSProperties;
  columnWrapperClassName?: string;
  columnHeaderClassName?: string;
}

const Column = (props: Props) => {
  const {
    index,
    data,
    loadMore,
    onColumnClick,
    onCardClick,
    renderColumnHeader,
    renderColumnWrapper,
    columnWrapperStyle,
    columnHeaderStyle,
    columnWrapperClassName,
    columnHeaderClassName,
  } = props;

  const containerClassName = classNames(
    withPrefix("column"),
    columnWrapperClassName
  );

  const ColumnWrapper = (children: React.ReactNode) =>
    renderColumnWrapper ? (
      renderColumnWrapper(data, {
        children,
        className: containerClassName,
        style: columnWrapperStyle?.(data),
      })
    ) : (
      <div className={containerClassName} style={columnWrapperStyle?.(data)}>
        {children}
      </div>
    );

  return ColumnWrapper(
    <div>
      <div>Hello</div>
    </div>
  );
};

export default Column;
