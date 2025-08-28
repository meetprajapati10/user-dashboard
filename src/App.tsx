import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ListOfUsers from "./pages/ListOfUsers";

function App() {
  return (
    <BrowserRouter basename="/user-dashboard">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<ListOfUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
