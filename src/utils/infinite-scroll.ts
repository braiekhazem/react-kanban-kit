import { debounce } from "lodash";

export const handleScroll = (
  e: any,
  listLength: number,
  currentPage: number,
  limit: number,
  onBottom: (p) => void,
  threshold?: number
) => {
  const { scrollTop, clientHeight, scrollHeight } = e.target;
  const scrollBottom = scrollHeight - (scrollTop + clientHeight);

  // const threshold = 40

  if (scrollBottom < (threshold || 0.4) && listLength > currentPage * limit)
    onBottom((prev) => prev + 1);
};

interface ScrollThresholdOptions {
  threshold?: number;
  debounceMs?: number;
  onThresholdReached: () => void;
}

export const createInfiniteScrollHandler = ({
  threshold = 0.7,
  debounceMs = 0,
  onThresholdReached,
}: ScrollThresholdOptions) => {
  if (threshold < 0 || threshold > 1) {
    console.error("Threshold must be a number between 0 and 1");
    return;
  }

  const handleInfiniteScroll = debounce((event) => {
    const target = event.target as HTMLElement;

    if (!target) {
      console.error("Unexpected error: event target is not an HTMLElement");
      return;
    }

    const { scrollTop, clientHeight, scrollHeight } = target;
    const scrollBottom = scrollHeight - (scrollTop + clientHeight);
    const scrollBottomPercentage = scrollBottom / scrollHeight;

    if (scrollBottomPercentage <= 1 - threshold) onThresholdReached();
  }, debounceMs);

  return handleInfiniteScroll;
};
