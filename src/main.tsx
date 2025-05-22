import ReactDOM from "react-dom/client";
import { Board } from "./";
import { mockData } from "./utils/mocks/data";

// Registering Syncfusion license key

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div style={{ width: "100%", height: "100vh" }}>
    <Board
      renderCard={(item) => (
        <div style={{ height: 200, backgroundColor: "white" }}>
          {item.title}
        </div>
      )}
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
      renderFooterTasksList={() => <div>Footer</div>}
      dataSource={mockData}
    />
  </div>
);
