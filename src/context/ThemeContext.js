import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1559A5",
      light: "#63a4ff",
      dark: "#004ba0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#dc004e",
      light: "#ff5c8d",
      dark: "#9a0036",
      contrastText: "#fff",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#fff",
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#fff",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#fff",
    },
    text: {
      primary: "#212121",
      secondary: "#757575",
      disabled: "#bdbdbd",
      hint: "#9e9e9e",
    },
    background: {
      paper: "#fff",
      default: "#fafafa",
    },
  },
  typography: {
    fontFamily: ["Roboto", "Helvetica Neue", "Arial", "sans-serif"].join(","),
    h1: {
      fontSize: "4rem",
      fontWeight: 500,
      letterSpacing: "-0.01562em",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "3.25rem",
      fontWeight: 500,
      letterSpacing: "-0.00833em",
      lineHeight: 1.2,
    },
    // add more custom typography settings here
  },
});

export default theme;
