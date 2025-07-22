import { BoardData } from "@/components";

export const getColumnsFromDataSource = (dataSource: BoardData) => {
  if (!dataSource?.root) return [];
  return dataSource.root.children?.map((child) => dataSource[child]) || [];
};
