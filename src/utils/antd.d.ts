declare module "antd" {
  import { FC, ReactNode } from "react";

  export interface SkeletonProps {
    active?: boolean;
    avatar?: boolean | object;
    loading?: boolean;
    paragraph?: boolean | object;
    title?: boolean | object;
    round?: boolean;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }

  export const Skeleton: FC<SkeletonProps>;
}
