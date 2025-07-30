import React from "react";
import { withPrefix } from "@/utils/getPrefix";

export type SkeletonAnimationType = "shimmer" | "pulse" | "wave";

interface CardSkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  animationType?: SkeletonAnimationType;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({
  className,
  style,
  animationType = "shimmer",
}) => {
  const skeletonClass = `${withPrefix("skeleton")} ${
    animationType === "pulse" ? withPrefix("skeleton-pulse") : ""
  } ${animationType === "wave" ? withPrefix("skeleton-wave") : ""} ${
    className || ""
  }`.trim();

  const renderDefaultSkeleton = () => (
    <div className={withPrefix("skeleton-content")}>
      <div className={withPrefix("skeleton-title")}></div>

      <div className={withPrefix("skeleton-description")}>
        <div className={withPrefix("skeleton-line")}></div>
        <div
          className={`${withPrefix("skeleton-line")} ${withPrefix(
            "skeleton-line-short"
          )}`}
        ></div>
      </div>
    </div>
  );

  return (
    <div className={skeletonClass} style={style}>
      {renderDefaultSkeleton()}
    </div>
  );
};

export default CardSkeleton;
