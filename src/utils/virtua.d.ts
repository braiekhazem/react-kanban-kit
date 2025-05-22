declare module "virtua" {
  import { ReactNode, ComponentType } from "react";

  export interface VListProps {
    items: any[];
    overscan?: number;
    onScroll?: (offset: any) => void;
    height?: number | string;
    itemHeight?: number | ((index: number) => number);
    children: (index: any) => ReactNode;
    tabIndex?: number;
    className?: string;
    style?: React.CSSProperties;
    scrollerRef?: React.RefObject<any>;
    customScrollbars?: boolean;
    scrollToItemOpts?: any;
  }

  export const VList: ComponentType<VListProps>;
}
