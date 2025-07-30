import { BoardItem, ScrollEvent } from "@/components";
import { withPrefix } from "./getPrefix";

export const handleScroll = (
  e: React.UIEvent<HTMLDivElement> | number,
  virtualization: boolean,
  onScroll: (e: ScrollEvent, column: BoardItem) => void,
  column: BoardItem
) => {
  const scrollContainer = document.querySelector(
    `.${withPrefix("column-content-list")}`
  );
  if (!scrollContainer) return;

  const { scrollHeight, clientHeight } = scrollContainer;
  let offset: number;
  if (virtualization) {
    offset = typeof e === "number" ? e : 0;
  } else {
    const target = (e as React.UIEvent<HTMLDivElement>)
      .target as HTMLDivElement;
    offset = target.scrollTop;
  }

  const syntheticEvent = {
    target: {
      scrollTop: offset,
      scrollHeight,
      clientHeight,
    },
  };

  onScroll?.(syntheticEvent, column);
};
