import ReactDOM from "react-dom/client";
import { useState } from "react";
import { Kanban, dropColumnHandler } from "./";
import { mockData } from "./utils/mocks/data";
import CardSkeleton from "./components/CardSkeleton";

import type { BoardData } from "./";

const App = () => {
  const [dataSource, setDataSource] = useState<BoardData>(mockData);

  return (
    <div style={{ width: "100%", height: "86dvh" }}>
      <Kanban
        viewOnly={false}
        allowColumnDrag
        dataSource={dataSource}
        onColumnMove={(move) => {
          setDataSource(dropColumnHandler(move, dataSource));
        }}
        renderColumnHeader={(column) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              padding: "10px",
            }}
          >
            <span>{column.title}</span>
            {column.isDraggable === false && (
              <span style={{ fontSize: "12px", opacity: 0.6 }}>locked</span>
            )}
          </div>
        )}
        renderColumnAdder={() => <div>Add new Column</div>}
        allowColumnAdder={true}
        allowListFooter={(column) => true}
        renderListFooter={(column) => <div>Add new one</div>}
        rootClassName="check"
        onCardClick={(e, card) => {
          console.log();
        }}
        // renderCardDragPreview={(card, info) => {
        //   return (
        //     <div
        //       style={{
        //         height: "92px",
        //         backgroundColor: "red",
        //         width: "233px",
        //       }}
        //     >
        //       Preview of {card.title}
        //     </div>
        //   );
        // }}
        // renderCardDragIndicator={(card, info) => {
        //   return (
        //     <div
        //       style={{
        //         height: 0,
        //         borderRadius: "20px",
        //         border: "2px dashed red",
        //       }}
        //     ></div>
        //   );
        // }}
        // renderColumnFooter={(column) => (
        //   <div>
        //     {column.title} have total as {column?.totalChildrenCount}
        //   </div>
        // )}
        // renderColumnWrapper={(column, { children, className, style }) => (
        //   <div
        //     style={{
        //       ...style,
        //       backgroundColor: "red",
        //       ...(collapsed ? { width: "100px", minWidth: "100px" } : {}),
        //     }}
        //     className={`${className} hello there`}
        //   >
        //     {collapsed ? column?.title : children}
        //   </div>
        // )}
        // columnHeaderStyle={(column) => ({
        //   backgroundColor: "red",
        //   padding: "10px",
        // })}
        // columnWrapperStyle={(column) => ({
        //   backgroundColor: "green",
        //   padding: "10px",
        // })}

        // renderSkeletonCard={({ index, column }) => (
        //   <div>
        //     Loading {index} {column.title} ...
        //   </div>
        // )}

        // Custom skeleton examples:
        renderSkeletonCard={() => <CardSkeleton animationType="shimmer" />}
        // renderSkeletonCard={({ index, column }) => (
        //   <CardSkeleton
        //     variant="compact"
        //     animationType="pulse"
        //   />
        // )}
        // onScroll={(e, column) => {
        //   console.log(e, column);
        // }}
        // columnStyle={(column) => ({
        //   backgroundColor: dragOverColumn === column.id ? "red" : "blue",
        // })}
        onCardMove={(event) => {
          console.log({ event });
        }}
        cardsGap={6}
        // cardWrapperStyle={(card, col) => {
        //   console.log({ col, card });
        //   return {
        //     backgroundColor: "red",
        //     padding: "10px",
        //   };
        // }}
        renderCardDragPreview={(card, info) => {
          console.log({ card, info });
          return (
            <div
              style={{
                backgroundColor: "red",
                height: info?.state?.dragging?.height,
                width: info?.state?.dragging?.width,
                transform: "rotate(4deg)",
                borderRadius: "10px",
              }}
            >
              Preview of {card.title}
            </div>
          );
        }}
        cardWrapperClassName="card-hazem"
        // loadMore={(columnId) => {
        //   console.log("loadMore", columnId);
        // }}
        // onCardDndStateChange={(info) => {
        //   console.log({ info });
        //   if (info.state.type === "idle") {
        //     setDragOverColumn(info.column?.id);
        //   }
        // }}
        // onColumnDndStateChange={(info) => {
        //   if (info.state.type === "is-card-over") {
        //     setDragOverColumn(info.column?.id);
        //   } else {
        //     setDragOverColumn(null);
        //   }
        // }}
        virtualization={true} // Set to false to disable virtualization and use normal map instead
        configMap={{
          card: {
            render: (props) => (
              <div
                style={{
                  background: "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  height: "70px",
                }}
              >
                Card {props.data.title}
              </div>
            ),
            isDraggable: true,
          },
          // divider: {
          //   render: (props) => (
          //     <div
          //       style={{
          //         width: "100%",
          //         height: "10px",
          //         backgroundColor: "green",
          //       }}
          //     ></div>
          //   ),
          //   isDraggable: true,
          // },
          cardLoading: {
            render: () => <div>Card Loading</div>,
            isDraggable: true,
          },
          footer: {
            render: () => {
              return <div>Add Task</div>;
            },
            isDraggable: false,
          },
        }}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />,
);
