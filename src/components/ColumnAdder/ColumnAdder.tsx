import { useKanbanContext } from "@/context/KanbanContext";
import { withPrefix } from "@/utils/getPrefix";
import React from "react";

interface Props {
  renderColumnAdder: () => React.ReactNode;
}

const ColumnAdder = ({ renderColumnAdder }: Props) => {
  const { allowColumnAdder = true } = useKanbanContext();
  if (!allowColumnAdder) return null;

  return (
    <div className={withPrefix("column-adder")}>{renderColumnAdder?.()}</div>
  );
};

export default ColumnAdder;
