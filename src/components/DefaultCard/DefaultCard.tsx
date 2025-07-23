import React from "react";
import { CardRenderProps } from "../types";
import { withPrefix } from "@/utils/getPrefix";

const DefaultCard = (props: CardRenderProps) => {
  return <div className={withPrefix("default-card")}>{props?.data?.title}</div>;
};

export default DefaultCard;
