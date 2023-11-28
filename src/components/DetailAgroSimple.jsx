import React, { useContext, useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import db from "../utils/db";
export default function Detail() {
  const [ticket, setTicket] = useState(null);
  const [storedData, setStoredData] = useState([]);
  const [fetch, setFetch] = useState(0);
  const [aclaracion, setAclaracion] = useState('')
  useEffect(() => {
    const id = localStorage.getItem("idTicket");
    const productoString = localStorage.getItem("producto");
    const producto = JSON.parse(productoString)
    const aclaracionLocal = localStorage.getItem("aclaracion")
    setAclaracion(aclaracionLocal)
    
    const fetchTicket = async () => {
      const ticket = await db.tickets.get({ id: id });
      setTicket(ticket);
      const notaVenta = JSON.parse(ticket.notaVenta)
      setStoredData([
        { label: "Inicio", value: ticket.inicio },
        { label: "Fin", value: ticket.fin },
        { label: "Cliente", value: ticket.cliente },
        {
          label: "Entrega",
          value: ticket.entregaBruta,
        },
        {
          label: "T. Inicial",
          value: ticket.estadoInicial,
        },
        {
          label: "T. Final",
          value: ticket.estadoFinal,
        },
        {
          label: "Chofer",
          value: ticket.choferNombre,
        },
        {
          label: "Patente",
          value: ticket.patente,
        },  
        {
          label: "Producto",
          value: notaVenta.DescripcionProducto,
        },    
        {
          label: "Número de ticket",
          value: ticket.numeroVenta,
        },
      ]);
    };
    if (id != null) {
      fetchTicket();
    } else {
      setFetch((fetch) => fetch + 1);
    }
  }, [fetch]);

  return (
    <Box sx={{ marginBottom: 3, marginTop: 1 }}>
      {ticket != null && (
        <Box  sx={{
          "@media print": {
            marginLeft: ticket.cliente !== 'Tabacal' ? 3 : 0
          },
        }}>
          {storedData.map(({ label, value }) => (
            <Typography
              sx={{
                fontSize: "12px",
                "@media print": {
                  fontSize: "5px",
                  marginLeft: ticket.cliente !== 'Tabacal' ? 5 : 0
                },
              }}
              key={label}
              variant="body2"
            >
              <strong>{label}:</strong> {value}
            </Typography>
          ))}
          <Box sx={{
                "@media print": {
                  marginLeft: ticket.cliente !== 'Tabacal' ? 3 : 0
                },
              }}>
            {ticket.firma != undefined && (
            <img src={ticket.firma} alt="Signature" width="100px" />
          )}
           
          </Box>
          <Typography
              sx={{
                fontSize: "12px",
                "@media print": {
                  fontSize: "1px",
                  marginLeft: ticket.cliente !== 'Tabacal' ? 5 : 0
                },
              }}
              variant="body2"
            >
              <strong>Aclaración: </strong> {ticket.aclaracion ? ticket.aclaracion : aclaracion}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: "10px",
                marginTop: 3,
                "@media print": {
                  fontSize: "1px",
                  marginLeft: ticket.cliente !== 'Tabacal' ? 5 : 0
                },
              }}
            >
              Para este remito se aceptó el resultado de la prueba de agua.
            </Typography>
        </Box>
      )}
    </Box>
  );
}
