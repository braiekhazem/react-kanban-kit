import { withPrefix } from "./getPrefix";

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
