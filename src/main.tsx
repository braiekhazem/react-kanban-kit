import ReactDOM from "react-dom/client";
import { Kanban } from "./";
import { mockData } from "./utils/mocks/data";

// Registering Syncfusion license key

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div style={{ width: "100%", height: "86dvh" }}>
    <Kanban
      onColumnClick={(e, column) => {
        console.log(e, column);
      }}
      onCardClick={(e, card) => {
        console.log();
      }}
      // renderColumnFooter={(column) => (
      //   <div>
      //     {column.title} have total as {column?.totalChildrenCount}
      //   </div>
      // )}
      // renderColumnWrapper={(column, { children, className, style }) => (
      //   <div style={{ ...style, backgroundColor: "red" }}>{children}</div>
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

      rootClassName="check"
      dataSource={mockData}
      // virtualization={false} // Set to false to disable virtualization and use normal map instead
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
