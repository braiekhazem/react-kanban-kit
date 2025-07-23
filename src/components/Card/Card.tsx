import { withPrefix } from "@/utils/getPrefix";
import React from "react";
import { BoardItem } from "../types";

interface Props {
  render: (props: {
    data: BoardItem;
    column: BoardItem;
    index: number;
    isDraggable: boolean;
  }) => React.ReactNode;
  data: BoardItem;
  column: BoardItem;
  index: number;
  isDraggable: boolean;
}

const Card = (props: Props) => {
  const { render, data, column, index, isDraggable } = props;

  return (
    <div className={withPrefix("card")} draggable={isDraggable}>
      {render({ data, column, index, isDraggable })}
    </div>
  );
};

export default Card;
