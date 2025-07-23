import { BoardProps } from "@/components";
import { createContext, useContext } from "react";

const KanbanContext = createContext<BoardProps | undefined>(undefined);

export const useKanbanContext = () => {
  const context = useContext(KanbanContext);
  if (!context) throw new Error("KanbanContext must be used within a provider");
  return context;
};

export const KanbanProvider = ({
  children,
  ...props
}: BoardProps & { children: React.ReactNode }) => {
  return (
    <KanbanContext.Provider value={props}>{children}</KanbanContext.Provider>
  );
};
