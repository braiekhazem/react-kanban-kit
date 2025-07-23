import { debounce } from "lodash";
import { withPrefix } from "./getPrefix";

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

export const checkIfSkeletonIsVisible = ({ columnId, limit = 20 }): boolean => {
  const skeletons = document.querySelectorAll(
    `.${withPrefix("generic-item-skeleton")}[data-rkk-column="${columnId}"]`
  );

  if (!skeletons.length) return false;

  const skeletonsToCheck = Array.from(skeletons).slice(0, limit);

  const isVisible = skeletonsToCheck.some((skeleton) => {
    const { top, bottom } = skeleton.getBoundingClientRect();
    return top <= window.innerHeight && bottom >= 0;
  });

  return isVisible;
};
