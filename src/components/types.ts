import { CSSProperties, ReactNode } from "react";

export interface Column {
  id: string;
  name: string;
  totalItems?: number;
  isExpanded?: boolean;
  updatedFieldKey?: string;
  getUpdatedValue?: (value: any) => any;
  groupType?: string;
  content: any;
}

export type ConfigMap = {
  [type: string]: {
    render: (props: any) => React.ReactNode;
    isDraggable?: boolean;
  };
};

export interface BoardItem {
  id: string;
  title: string;
  parentId: string | null;
  children: string[];
  content?: any;
  type?: keyof ConfigMap;
  totalChildrenCount: number;
}

export interface BoardData {
  root: BoardItem;
  [key: string]: BoardItem;
}

export interface BoardProps {
  dataSource: BoardData;
  configMap: ConfigMap;
  loadMore?: (groupsId: string) => void;
  renderColumnHeader?: (column: BoardItem) => ReactNode;
  renderColumnWrapper?: (
    column: BoardItem,
    {
      children,
      className,
      style,
    }: { children: ReactNode; className?: string; style?: CSSProperties }
  ) => ReactNode;
  columnWrapperStyle?: (column: BoardItem) => CSSProperties;
  columnHeaderStyle?: (column: BoardItem) => CSSProperties;
  columnListContentStyle?: (column: BoardItem) => CSSProperties;
  columnListContentClassName?: string;
  columnWrapperClassName?: string;
  columnHeaderClassName?: string;
  rootStyle?: CSSProperties;
  rootClassName?: string;
  onColumnMove?: ({
    columnId,
    fromIndex,
    toIndex,
  }: {
    columnId: string;
    fromIndex: number;
    toIndex: number;
  }) => void;
  onCardMove?: ({
    cardId,
    fromColumnId,
    toColumnId,
    taskAbove,
    taskBelow,
    position,
  }: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    taskAbove: string | null;
    taskBelow: string | null;
    position: number;
  }) => void;
  renderColumnFooter?: (column: BoardItem) => ReactNode;
  onColumnClick?: (
    e: React.MouseEvent<HTMLDivElement>,
    column: BoardItem
  ) => void;
  onCardClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
  virtualization?: boolean; // Add option to enable/disable virtualization
}
