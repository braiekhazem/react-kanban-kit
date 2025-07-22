import ReactDOM from "react-dom/client";
import { Board } from "./";
import { mockData } from "./utils/mocks/data";

// Registering Syncfusion license key

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div style={{ width: "100%", height: "100vh" }}>
    <Board
      onColumnClick={(args) => {
        console.log(args);
      }}
      onCardMove={(args) => {
        console.log(args);
      }}
      renderColumnHeader={(column) => (
        <div>
          {column.name} {column?.totalItems}
        </div>
      )}
      dataSource={mockData}
      configMap={{
        card: {
          render: (props) => <div>Card</div>,
          isDraggable: true,
        },
        cardLoading: {
          render: (props) => <div>Card Loading</div>,
          isDraggable: true,
        },
      }}
    />
  </div>
);
