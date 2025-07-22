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
  renderColumnWrapper?: (column: BoardItem, children: ReactNode) => ReactNode;
  columnWrapperStyle?: (column: BoardItem) => CSSProperties;
  columnHeaderStyle?: (column: BoardItem) => CSSProperties;
  columnWrapperClassName?: string;
  columnHeaderClassName?: string;
  containerStyle?: CSSProperties;
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
  renderFooterColumn?: (column: BoardItem) => ReactNode;
  onColumnClick?: (column: BoardItem) => void;
  onCardClick?: (card: BoardItem) => void;
}
