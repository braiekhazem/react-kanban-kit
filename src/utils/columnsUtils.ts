import { BoardData, BoardItem } from "@/components";

export const getColumnsFromDataSource = (dataSource: BoardData) => {
  if (!dataSource?.root) return [];
  return dataSource.root.children?.map((child) => dataSource[child]) || [];
};

export const getColumnChildren = (column: BoardItem, dataSource: BoardData) => {
  if (!column) return [];
  return column.children?.map((child) => dataSource[child]) || [];
};
