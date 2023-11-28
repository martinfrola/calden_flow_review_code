import { useContext, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrintIcon from "@mui/icons-material/Print";
import { GlobalContext } from "../context/GlobalContext";
function TicketList({ tickets }) {
  const { context, setContext } = useContext(GlobalContext);
  const [selectedMode, setSelectedMode] = useState({});

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    if (mode !== "undefined") {
      setSelectedMode(JSON.parse(mode));
    }
  }, []);
  const handlePrint = (ticket) => {
    localStorage.setItem("idTicket", ticket.id);
    if(ticket.operacionVenta == 'Agro') {
      setContext({
        ...context,
        page: ticket.emiteTicket == "false" ? "agroDetail" : "detail",
      });
    } else {
      setContext({
        ...context,
        page: "detail",
      });
    }
    
  };
  return (
    <List>
      {tickets.length == 0 && (
        <Typography sx={{ marginLeft: 3 }}>
          Presione el botón "+" para agregar el primer ticket.
        </Typography>
      )}
      {tickets.map((ticket) => (
        <Paper key={ticket.id} elevation={3}>
          <ListItem>
            <ListItemText
              primary={
                "Ticket " + ticket.numeroVenta + ": " + ticket.entregaBruta
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="print"
                onClick={() => {
                  handlePrint(ticket);
                }}
              >
                <PrintIcon />
              </IconButton>
              {ticket.sent ? (
                <IconButton edge="end" aria-label="sent">
                  <CheckCircleIcon color="success" />
                </IconButton>
              ) : null}
            </ListItemSecondaryAction>
          </ListItem>
        </Paper>
      ))}
    </List>
  );
}

export default TicketList;
