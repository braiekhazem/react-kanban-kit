import { BoardProps } from "@/components";

export const getSharedProps = (props: BoardProps) => {
  const { viewOnly, virtualization, cardsGap } = props;
  return {
    viewOnly,
    virtualization,
    cardsGap,
  };
};
