import ReactDOM from "react-dom/client";
import { Kanban } from "./";
import { mockData } from "./utils/mocks/data";
import { useState } from "react";
import CardSkeleton from "./components/CardSkeleton"; // Uncomment to use in renderSkeletonCard examples

// Registering Syncfusion license key

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  return (
    <div style={{ width: "100%", height: "86dvh" }}>
      <button onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "Expand" : "Collapse"}
      </button>
      <Kanban
        onColumnClick={(e, column) => {
          console.log(e, column);
        }}
        viewOnly={false}
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
        //         height: info.height,
        //         backgroundColor: "red",
        //         borderRadius: "20px",
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
        // renderColumnHeader={(column) => (
        //   <div style={{ padding: "30px" }}>
        //     {column.title} have total as {column?.totalChildrenCount}
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
        renderSkeletonCard={({ index, column }) => (
          <CardSkeleton animationType="shimmer" />
        )}
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
        columnClassName={(column) =>
          dragOverColumn === column.id ? "drag-over-column" : ""
        }
        allowColumnAdder={true}
        renderColumnAdder={() => <div>Add new Column</div>}
        renderListFooter={(column) => <div>Add new one</div>}
        allowListFooter={(column) => true}
        rootClassName="check"
        dataSource={mockData}
        // cardsGap={30}
        // cardWrapperStyle={(card, col) => {
        //   console.log({ col, card });
        //   return {
        //     backgroundColor: "red",
        //     padding: "10px",
        //   };
        // }}
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
            render: (props) => <div>Card Loading</div>,
            isDraggable: true,
          },
          footer: {
            render: (props) => {
              console.log({ props });
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
  <App />
);
