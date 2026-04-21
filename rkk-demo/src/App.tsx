import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import { Overview, TrelloExample, ClickUpExample, JiraExample, InfiniteScrollExample } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/trello" element={<TrelloExample />} />
          <Route path="/clickup" element={<ClickUpExample />} />
          <Route path="/tam" element={<JiraExample />} />
          <Route path="/infinite-scroll" element={<InfiniteScrollExample />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
