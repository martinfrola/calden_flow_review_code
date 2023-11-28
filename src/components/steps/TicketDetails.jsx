import React, { useContext, useState, useEffect } from "react";
import {
  Typography,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { v4 as uuidv4 } from "uuid";
import Detail from "../Detail";
import { Button } from "@mui/material";
import { GlobalContext } from "../../context/GlobalContext";
import db from '../../utils/db'
import DetailAgroSimple from "../DetailAgroSimple";
export default function TicketDetails() {
  const { context, setContext } = useContext(GlobalContext);
  const [ticket, setTicket] = useState({})
  const [operation, setOperation] = useState({})
 useEffect(() => {
    const id = localStorage.getItem("idTicket");
    const ticket = db.tickets.get({ id: id }).then(ticket => setTicket(ticket))
    const operation = localStorage.getItem("operation");
    if (operation !== "undefined") {
      setOperation(JSON.parse(operation));
    }
    }, [])
  const onClose = () => {
    localStorage.removeItem("idTicket");
    localStorage.removeItem("cuarteo");
    localStorage.removeItem("preset");
    localStorage.removeItem("tabacalOperation");
    localStorage.removeItem("odometer");
    localStorage.removeItem("bloqueID");
    localStorage.removeItem("supervisorNombre");
    localStorage.removeItem("machine");
    localStorage.removeItem("supervisorLegajo");
    localStorage.removeItem("dispatched");
    localStorage.removeItem("bloqueDescripcion");
    localStorage.removeItem("entregaBruta");
    localStorage.removeItem("firma")
    setContext({
      ...context,
      page: "home",
      step: "step1",
    });
  };
  return (
    <>
      <DialogTitle
        sx={{
          "@media print": {
            display: "none",
          },
          paddingY: 0,
        }}
      >
        Datos del ticket
      </DialogTitle>
      <DialogContent
        style={{
          margin: "20px auto",
          fontSize: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: "14px",
            "@media print": {
              fontSize: "10px",
              marginLeft: ticket.cliente !== 'Tabacal' ? "65px" : 0
            },
          }}
        >
          <strong>MIC INGENIOS</strong>
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            "@media print": {
              fontSize: "8px",
              marginLeft: ticket.cliente !== 'Tabacal' ? "65px" : 0
            },
          }}
        >
          <strong>Combustibles del Norte S.A.</strong>
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            "@media print": {
              fontSize: "8px",
              marginLeft: ticket.cliente !== 'Tabacal' ? "65px" : 0
            },
          }}
        >
          <strong>Av. Chile 1275, CP 4400, Salta</strong>
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            "@media print": {
              fontSize: "8px",
              marginLeft: ticket.cliente !== 'Tabacal' ? "65px" : 0
            },
          }}
        >
          <strong>CUIT 30-68128447-4</strong>
        </Typography>
        {operation.title == "Agro" ? <DetailAgroSimple /> : <Detail />}
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
          <IconButton
            sx={{
              "@media print": {
                display: "none",
              },
            }}
            onClick={() => {
              window.MyInterface.imprimirPagina();
              window.print();
            }}
          >
            <PrintIcon fontSize="large" />
          </IconButton>
          <IconButton
            sx={{
              "@media print": {
                display: "none",
              },
            }}
          >
            <ExitToAppIcon fontSize="large" onClick={onClose} />
          </IconButton>
        </Box>
      </DialogContent>
    </>
  );
}
