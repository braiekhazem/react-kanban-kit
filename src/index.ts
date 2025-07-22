import "./components/_index.scss";
import { dropHandler, dropColumnHandler } from "./components/Board";

export type { BoardProps, BoardItem, BoardData } from "./components/types";
export { default as Board } from "./components/Board";
export { default as TaskSkeleton } from "./components/TaskSkeleton";
export { dropHandler, dropColumnHandler };
