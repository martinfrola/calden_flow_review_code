import React, { useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography, Box } from "@mui/material";
import db from "../utils/db";
export default function Detail() {
  const [ticket, setTicket] = useState(null);
  const [storedData, setStoredData] = useState([]);
  const [fetch, setFetch] = useState(0);
  useEffect(() => {
    const id = localStorage.getItem("idTicket");
    const productoString = localStorage.getItem("producto");
    const producto = JSON.parse(productoString)

    const fetchTicket = async () => {
      const ticket = await db.tickets.get({ id: id });
      setTicket(ticket);
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
        ...(ticket.operacionVenta !== 'Ledesma Tanques'
            ? [
              {
                label: "Máquina",
                value: ticket.maquina,
              },
              {
                label: "Horómetro",
                value: ticket.horometro,
              },
              ...(ticket.operacionVenta !== 'Ledesma Capilar' 
                ? [
                    {
                      label: "Operación",
                      value: ticket.operacion,
                    },
                    {
                      label: "Producto",
                      value: producto.DescripcionArticulo,
                    },
                  ]
                : []),
            
              {
                label: "Bloque",
                value: ticket.bloqueDescripcion,
              },
              {
                label: "Supervisor",
                value: ticket.supervisorLegajo + ": " + ticket.supervisorNombre,
              },
            ]:[]),
        ...(ticket.cuarteo == "true"
          ? [
              {
                label: "Cuarteo",
                value: "Sí",
              },
            ]
          : []),
        {
          label: "Número de ticket",
          value: ticket.numeroVenta,
        },
      ]);
    };
    if (id != null) {
      fetchTicket();
    } else {
      console.log("estoy acá", id);
      setFetch((fetch) => fetch + 1);
    }
  }, [fetch]);

  return (
    <Box sx={{ marginBottom: 3, marginTop: 1 }}>
      {ticket != null && (
        <Box>
          {storedData.map(({ label, value }) => (
            <Typography
              sx={{
                fontSize: "12px",
                "@media print": {
                  fontSize: "5px",
                  marginLeft: ticket.cliente !== 'Tabacal' ? "65px" : 0
                },
              }}
              key={label}
              variant="body2"
            >
              <strong>{label}:</strong> {value}
            </Typography>
          ))}
          <Box  sx={{
                "@media print": {
                  marginLeft: ticket.cliente !== 'Tabacal' ? "65px" : 0
                },
              }}>
            {ticket.firma != undefined && (
            <img src={ticket.firma} alt="Signature" width="100px" />
          )}
          </Box>
          
        </Box>
      )}
    </Box>
  );
}
