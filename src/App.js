import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useState, useMemo } from "react";
import theme from "./Components/Theme";
import UserDashboard from "./Components/Dashboard";
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const currentTheme = useMemo(() => theme(darkMode), [darkMode]);

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<UserDashboard darkMode={darkMode} setDarkMode={setDarkMode} />}
            />
            <Route
              path="/dashboard"
              element={<UserDashboard darkMode={darkMode} setDarkMode={setDarkMode} />}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;