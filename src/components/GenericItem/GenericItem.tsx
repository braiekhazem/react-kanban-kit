import React from "react";
import { BoardItem, ConfigMap } from "../types";

interface Props {
  index: number;
  options: {
    data: BoardItem;
    column: BoardItem;
    configMap: ConfigMap;
    //isSkeleton is used to show a skeleton UI when the item is not loaded yet
    isSkeleton: boolean;
  };
}

const GenericItem = (props: Props) => {
  const { index, options } = props;
  const { data, column, configMap, isSkeleton } = options;

  return (
    <div
      style={{
        padding: "8px",
        margin: "4px 0",
        backgroundColor: "white",
        borderRadius: "4px",
      }}
    >
      {isSkeleton ? <div>Loading...</div> : <div>GenericItem</div>}
    </div>
  );
};

export default GenericItem;
