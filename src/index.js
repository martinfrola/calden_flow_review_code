import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { GlobalContextProvider } from "./context/GlobalContext";
import App from "./App";
import theme from "./context/ThemeContext";
import { register } from "./serviceWorkerRegistration";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <ThemeProvider theme={theme}>
      <GlobalContextProvider>
        <App />
      </GlobalContextProvider>
    </ThemeProvider>
);
register();
