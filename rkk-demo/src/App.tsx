import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components";
import { Overview, TrelloExample, ClickUpExample, JiraExample } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/trello" element={<TrelloExample />} />
          <Route path="/clickup" element={<ClickUpExample />} />
          <Route path="/tam" element={<JiraExample />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
