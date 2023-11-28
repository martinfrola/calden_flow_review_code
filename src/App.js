import "./styles.css";
import React, { useContext, useEffect } from "react";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import { GlobalContext } from "./context/GlobalContext";
import Nav from "./components/Nav";
import { Box } from "@mui/material";
import TicketDialog from "./pages/TicketDialog";
import TabacalConfig from "./pages/TabacalConfig";
import NotaDeVenta from "./pages/NotaDeVenta";
import { updateDataFetching } from "./API/autocompleteData";
import DetailAgro from "./components/steps/DetailAgro";
import TicketDetails from "./components/steps/TicketDetails";
export default function App() {
  const { context } = useContext(GlobalContext);
  useEffect(() => {
    updateDataFetching("drivers");
    updateDataFetching("trucks");
    updateDataFetching("supervisors");
    updateDataFetching("machines");
    updateDataFetching("blocks");
  }, [context.page]);

  return (
    <Box sx={{"@media print": {
                  margin: 0,
                  padding: 0
                },
              }}>
      {/* <Nav /> */}
      {context.page === undefined && <h1>{context}</h1>}
      {context.page === "home" && <Home />}
      {context.page === "settings" && <Settings />}
      {context.page === "newTicket" && <TicketDialog />}
      {context.page === "tabacalConfig" && <TabacalConfig />}
      {context.page === "agroConfig" && <NotaDeVenta />}
      {context.page === "detail" && <TicketDetails />}
      {context.page === "agroDetail" && <DetailAgro />}
    </Box>
  );
}
