import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Stats from "./components/Stats/Stats";
import NavBar from "./components/NavBar/NavBar";
import AddExpense from "./components/ManageExpense/ManageExpense";
import NoPage from "./components/NoPage/NoPage";
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from "./components/Welcome/Welcome";

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route
          path="add"
          element={isAuthenticated ? <AddExpense /> : <Welcome />}
        />
        <Route
          path="stats"
          element={isAuthenticated ? <Stats /> : <Welcome />}
        />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
