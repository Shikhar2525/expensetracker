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
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme, GlobalStyle } from "./theme";
import { Online, Offline, Detector } from "react-detect-offline";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState();

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkThemeMq.matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  useEffect(() => {
    if (isLoading) {
      setProgress(100);
    }
  }, [isLoading]);

  const blockPointer = () => {
    if (document != null) {
      document.body.style.pointerEvents = "none";
      if (document.getElementById("temp") != null)
        document.getElementById("temp").style.filter = "blur(1.5px)";
    }
  };

  const allowPointer = () => {
    if (document != null) {
      document.body.style.pointerEvents = "all";
      if (document.getElementById("temp") != null)
        document.getElementById("temp").style.filter = "";
    }
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyle />
      <styleApp>
        <BrowserRouter>
          <LoadingBar
            color="#f11946"
            progress={progress}
            loaderSpeed={1700}
            onLoaderFinished={() => setProgress(0)}
          />
          <Detector
            render={({ online }) => (
              <>
                {online ? (
                  allowPointer()
                ) : (
                  <>
                    {blockPointer()}
                    <div className="container bg-danger internet">
                      <i class="bi bi-wifi-off"></i> You are offline. Check your
                      connection.
                    </div>
                  </>
                )}
              </>
            )}
          />

          <div id="temp">
            <NavBar toggler={() => themeToggler()} />
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
          </div>
        </BrowserRouter>
      </styleApp>
    </ThemeProvider>
  );
}

export default App;
