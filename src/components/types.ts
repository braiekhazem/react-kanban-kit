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

export interface BoardItem {
  id: string;
  title: string;
  children: string[];
  content: any;
  parentId?: string;
  isSubtask?: boolean;
  collapsed?: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  groupType?: string;
  tasksIds?: string[];
  updatedFieldKey?: string;
  subtasks?: string[]; // IDs of subtasks
  loadingItems?: number;
  isLoading?: boolean;
  totalItems?: number;
}

export interface BoardData {
  [key: string]: BoardItem;
}

export interface BoardProps {
  dataSource: BoardData;
  loadMore?: (groupsId: string) => void;
  renderCard?: (
    item: BoardItem,
    options: { isSubtask: boolean; hasSubtasks: boolean; depth: number }
  ) => ReactNode;
  renderTaskAdder?: (
    column: Column,
    parentItem: BoardItem | null,
    adder: BoardItem
  ) => ReactNode;
  renderColumnHeader?: (column: Column) => ReactNode;
  renderColumnContainer?: (column: Column) => ReactNode;
  allowAddColumn?: boolean;
  renderColumnAdder?: () => ReactNode;
  onColumnAdd?: () => void;
  containerStyle?: CSSProperties;
  columnContainerStyle?: (column: Column) => CSSProperties;
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
  onToggleSubtasks?: (taskId: string) => void;
  maxNestedLevel?: number;
  renderFooterTasksList?: (column: Column) => ReactNode;
  renderFooterColumn?: (column: Column) => ReactNode;
  onColumnClick?: (column: Column) => void;
}

export interface ColumnProps {
  column: Column;
  items: BoardItem[];
  renderCard: (item: BoardItem) => ReactNode;
  renderColumnHeader?: (column: Column) => ReactNode;
}
