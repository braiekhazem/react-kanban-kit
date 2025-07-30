import { TaskCardState } from "@/global/dnd/useCardDnd";
import { TColumnState } from "@/global/dnd/useColumnDnd";
import { CSSProperties, ReactNode } from "react";

export interface DndState {
  state: TaskCardState | TColumnState;
  column?: BoardItem;
  card?: BoardItem;
}

export interface ScrollEvent {
  target: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  };
}

export type CardRenderProps = {
  data: BoardItem;
  column: BoardItem;
  index: number;
  isDraggable: boolean;
};

export type ConfigMap = {
  [type: string]: {
    render: (props: CardRenderProps) => React.ReactNode;
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
  // totalChildrenCount is the total number of children in the column
  totalChildrenCount: number;
  // totalItemsCount is the total number of items (real content) in the column
  totalItemsCount?: number;
  isDraggable?: boolean;
}

export interface BoardData {
  root: BoardItem;
  [key: string]: BoardItem;
}

export interface BoardProps {
  dataSource: BoardData;
  configMap: ConfigMap;
  viewOnly?: boolean;
  loadMore?: (groupsId: string) => void;
  renderSkeletonCard?: ({
    index,
    column,
  }: {
    index: number;
    column: BoardItem;
  }) => ReactNode;
  renderColumnHeader?: (column: BoardItem) => ReactNode;
  renderCardDragIndicator?: (card: BoardItem, info: any) => ReactNode;
  renderCardDragPreview?: (card: BoardItem, info: any) => ReactNode;
  // renderColumnDragIndicator?: (column: BoardItem, info: any) => ReactNode;
  // renderColumnDragPreview?: (column: BoardItem, info: any) => ReactNode;

  renderListFooter?: (column: BoardItem) => ReactNode;
  allowListFooter?: (column: BoardItem) => boolean;

  renderColumnAdder?: () => ReactNode;
  allowColumnAdder?: boolean;

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
  columnListContentClassName?: (column: BoardItem) => string;
  columnWrapperClassName?: (column: BoardItem) => string;
  columnHeaderClassName?: (column: BoardItem) => string;
  columnClassName?: (column: BoardItem) => string;
  columnStyle?: (column: BoardItem) => CSSProperties;
  rootStyle?: CSSProperties;
  rootClassName?: string;
  cardWrapperStyle?: (card: BoardItem, column: BoardItem) => CSSProperties;
  cardWrapperClassName?: string;
  virtualization?: boolean;
  cardsGap?: number;
  // renderGap?: (column: BoardItem) => ReactNode;
  onScroll?: (e: ScrollEvent, column: BoardItem) => void;
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
  onCardDndStateChange?: (info: DndState) => void;
  onColumnDndStateChange?: (info: DndState) => void;
}

export interface DropParams {
  source: {
    id: string;
    data: any;
  };
  location: {
    current: {
      dropTargets: Array<{
        data: any;
      }>;
    };
  };
  columns: BoardItem[];
  dataSource: BoardData;
  onCardMove?: BoardProps["onCardMove"];
  onColumnMove?: BoardProps["onColumnMove"];
}
