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
  onClick?: (e: React.MouseEvent<HTMLDivElement>, card: BoardItem) => void;
}

const Card = (props: Props) => {
  const { render, data, column, index, isDraggable, onClick } = props;

  return (
    <div className={withPrefix("card")} onClick={(e) => onClick?.(e, data)}>
      {render({ data, column, index, isDraggable })}
    </div>
  );
};

export default Card;
