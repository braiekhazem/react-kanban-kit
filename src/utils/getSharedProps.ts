import { BoardProps } from "@/components";

export const getSharedProps = (props: BoardProps) => {
  const {
    viewOnly = false,
    virtualization = true,
    cardsGap = 8,
    allowColumnAdder = true,
    allowListFooter,
  } = props;
  return {
    viewOnly,
    virtualization,
    cardsGap,
    allowColumnAdder,
    allowListFooter,
  };
};
