import { BoardData, BoardItem } from "@/components";

export const getColumnsFromDataSource = (dataSource: BoardData) => {
  if (!dataSource?.root) return [];
  return dataSource.root.children?.map((child) => dataSource[child]) || [];
};

export const getColumnChildren = (column: BoardItem, dataSource: BoardData) => {
  if (!column) return [];
  return column.children?.map((child) => dataSource[child]) || [];
};

export const getHeaderHeight = (header: HTMLDivElement): number => {
  if (!header) return 0;
  const style = window.getComputedStyle(header);
  const marginTop = parseFloat(style.marginTop) || 0;
  const marginBottom = parseFloat(style.marginBottom) || 0;
  return header.offsetHeight + marginTop + marginBottom;
};
