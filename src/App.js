import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Stats from "./components/Stats/Stats";
import NavBar from "./components/NavBar/NavBar";
import NoPage from "./components/NoPage/NoPage";
import { useAuth0 } from "@auth0/auth0-react";
import Welcome from "./components/Welcome/Welcome";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import LoadingBar from "react-top-loading-bar";
import { useState, useEffect } from "react";
import ManageExpense from "./components/ManageExpense/ManageExpense";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(100);
    }
  }, [isLoading]);

  return (
    <BrowserRouter>
      <LoadingBar
        color="#f11946"
        progress={progress}
        loaderSpeed={1700}
        onLoaderFinished={() => setProgress(0)}
      />

      <NavBar />
      <ScrollToTop />
      <Routes>
        <Route index element={<Home />} />
        <Route
          path="manage"
          element={isAuthenticated ? <ManageExpense /> : <Welcome />}
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
