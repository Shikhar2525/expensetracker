import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Stats from "./components/Stats/Stats";
import NavBar from "./components/NavBar/NavBar";
import AddExpense from "./components/AddExpense/AddExpense";
import NoPage from "./components/NoPage/NoPage";
function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="add" element={<AddExpense />} />
        <Route path="stats" element={<Stats />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
