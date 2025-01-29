import { createTheme } from "@mui/material/styles";

const theme = (darkMode) =>
  createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#7E57C2", // Purple
        light: "#9575CD",
        dark: "#5E35B1",
      },
      secondary: {
        main: "#26A69A", // Teal
        light: "#4DB6AC",
        dark: "#00897B",
      },
      background: {
        default: darkMode ? "#121212" : "#F5F5F7",
        paper: darkMode ? "#1E1E1E" : "#FFFFFF",
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? "#1E1E1E" : "#7E57C2",
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 8,
          },
        },
      },
    },
  });

export default theme;
