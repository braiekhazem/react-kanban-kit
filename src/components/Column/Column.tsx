import React, { Fragment, useEffect, useRef, useState } from "react";
import { BoardItem, ConfigMap } from "../types";
import { withPrefix } from "@/utils/getPrefix";
import classNames from "classnames";
import ColumnHeader from "../ColumnHeader";
import ColumnContent from "../ColumnContent";
import { getHeaderHeight } from "@/utils/columnsUtils";

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
  columnListContentStyle?: (column: BoardItem) => React.CSSProperties;
  columnListContentClassName?: string;
  items: BoardItem[];
}

const Column = (props: Props) => {
  const {
    index,
    data,
    loadMore,
    items,
    onColumnClick,
    onCardClick,
    renderColumnHeader,
    renderColumnWrapper,
    renderColumnFooter,
    columnWrapperStyle,
    columnHeaderStyle,
    columnWrapperClassName,
    columnHeaderClassName,
    columnListContentStyle,
    columnListContentClassName,
  } = props;

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setHeaderHeight(getHeaderHeight(headerRef.current));
  }, [headerRef.current]);

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
              headerHeight={headerHeight}
            />
            {renderColumnFooter?.(data)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Column;
