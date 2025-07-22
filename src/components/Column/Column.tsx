import React, { Fragment } from "react";
import { BoardItem, ConfigMap } from "../types";
import { withPrefix } from "@/utils/getPrefix";
import classNames from "classnames";
import ColumnHeader from "../ColumnHeader";

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
    withPrefix("column-outer"),
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

  return (
    <div onClick={(e) => onColumnClick?.(e, data)}>
      {ColumnWrapper(
        <div className={withPrefix("column")}>
          <div className={withPrefix("column-wrapper ")}>
            <ColumnHeader
              renderColumnHeader={renderColumnHeader}
              columnHeaderStyle={columnHeaderStyle}
              columnHeaderClassName={columnHeaderClassName}
              data={data}
            />
            <div className={withPrefix("column-content")}>content</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
