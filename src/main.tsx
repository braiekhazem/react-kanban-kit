import ReactDOM from "react-dom/client";
import { Kanban } from "./";
import { mockData } from "./utils/mocks/data";

// Registering Syncfusion license key

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div style={{ width: "100%", height: "100vh" }}>
    <Kanban
      onColumnClick={(args) => {
        console.log(args);
      }}
      onCardMove={(args) => {
        console.log(args);
      }}
      // renderColumnWrapper={(column, { children, className, style }) => (
      //   <div>{children}</div>
      // )}
      renderColumnHeader={(column) => (
        <div>
          {column.name} {column?.totalItems}
        </div>
      )}
      rootClassName="check"
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
