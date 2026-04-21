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
        dataSource={dataSource}
        allowColumnDrag
        onColumnMove={(move) => {
          setDataSource(dropColumnHandler(move, dataSource));
        }}
        onCardMove={(event) => {
          console.log("card moved:", event);
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
        allowListFooter={() => true}
        renderListFooter={() => <div>Add new one</div>}
        renderSkeletonCard={() => <CardSkeleton animationType="shimmer" />}
        renderCardDragPreview={(card, info) => (
          <div
            style={{
              backgroundColor: "#fff",
              height: info?.state?.dragging?.height,
              width: info?.state?.dragging?.width,
              transform: "rotate(4deg)",
              borderRadius: "10px",
              border: "1px solid #ccc",
              padding: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            Preview of {card.title}
          </div>
        )}
        renderCardDragIndicator={() => (
          <div
            style={{
              height: 0,
              borderRadius: "20px",
              border: "2px dashed #4a90d9",
            }}
          />
        )}
        // renderColumnDragPreview={(column, info) => (
        //   <div
        //     style={{
        //       backgroundColor: "#fff",
        //       border: "1px solid #ddd",
        //       borderRadius: "12px",
        //       padding: "12px",
        //       width: info?.state?.dragging?.width,
        //       height: info?.state?.dragging?.height,
        //       boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        //       transform: "rotate(4deg)",
        //     }}
        //   >
        //     <div style={{ fontWeight: 600, marginBottom: "8px" }}>
        //       {column.title}
        //     </div>
        //     <div style={{ opacity: 0.7, fontSize: "12px" }}>
        //       Dragging column
        //     </div>
        //   </div>
        // )}
        renderColumnDragIndicator={(_column, _info) => (
          <div
            style={{
              width: _info.width,
              height: _info.height,
              backgroundColor: "#4a90d9",
              borderRadius: 4,
            }}
          />
        )}
        virtualization={true}
        cardsGap={6}
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
          footer: {
            render: () => <div>Add Task</div>,
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
