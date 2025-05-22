# React Kanban Kit

A flexible and customizable Kanban board component for React applications, built with TypeScript and modern drag-and-drop functionality.

## Features

- 🎯 Drag and drop cards between columns
- 📱 Responsive design
- 🎨 Customizable card and column rendering
- 🔄 Virtual scrolling for better performance
- 📦 TypeScript support
- 🎮 Nested subtasks support
- 🎯 Column reordering
- 🎨 Customizable styling

## Installation

```bash
npm install react-kanban-kit
# or
yarn add react-kanban-kit
```

## Basic Usage

```tsx
import { Board } from "react-kanban-kit";

const MyKanbanBoard = () => {
  const dataSource = {
    root: {
      children: ["col-1", "col-2", "col-3"],
    },
    "col-1": {
      id: "col-1",
      children: ["task-1", "task-2"],
      content: {
        group: {
          name: "To Do",
        },
      },
    },
    "task-1": {
      id: "task-1",
      content: {
        title: "Task 1",
        description: "Description for task 1",
      },
    },
    // ... more tasks and columns
  };

  const renderCard = (item, options) => (
    <div className="custom-card">
      <h3>{item.content.title}</h3>
      <p>{item.content.description}</p>
    </div>
  );

  return (
    <Board
      dataSource={dataSource}
      renderCard={renderCard}
      onCardMove={(move) => {
        console.log("Card moved:", move);
      }}
      onColumnMove={(move) => {
        console.log("Column moved:", move);
      }}
    />
  );
};
```

## Props

| Prop                    | Type                                                         | Description                                   |
| ----------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `dataSource`            | `BoardData`                                                  | The data structure for the Kanban board       |
| `renderCard`            | `(item: BoardItem, options: CardRenderOptions) => ReactNode` | Custom card renderer                          |
| `renderColumnHeader`    | `(column: Column) => ReactNode`                              | Custom column header renderer                 |
| `onCardMove`            | `(move: CardMove) => void`                                   | Callback when a card is moved                 |
| `onColumnMove`          | `(move: ColumnMove) => void`                                 | Callback when a column is moved               |
| `containerStyle`        | `CSSProperties`                                              | Custom styles for the board container         |
| `columnContainerStyle`  | `(column: Column) => CSSProperties`                          | Custom styles for column containers           |
| `loadMore`              | `(columnId: string) => void`                                 | Function to load more items in a column       |
| `maxNestedLevel`        | `number`                                                     | Maximum level of nested subtasks (default: 1) |
| `renderTaskAdder`       | `(parentTask?: BoardItem) => ReactNode`                      | Custom task adder component                   |
| `renderFooterTasksList` | `() => ReactNode`                                            | Custom footer component for tasks list        |
| `renderFooterColumn`    | `(column: Column) => ReactNode`                              | Custom footer component for columns           |
| `onColumnClick`         | `(column: Column) => void`                                   | Callback when a column is clicked             |

## Data Structure

The `dataSource` prop should follow this structure:

```typescript
interface BoardData {
  root: {
    children: string[]; // Column IDs
  };
  [key: string]: {
    id: string;
    children?: string[]; // Task IDs
    content: {
      group?: {
        name: string;
      };
      title?: string;
      description?: string;
      // ... other task properties
    };
    isExpanded?: boolean;
    totalItems?: number;
  };
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Hazem braiek
