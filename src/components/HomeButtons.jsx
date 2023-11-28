import React, { useContext, useState, useEffect } from "react";
import { Box, Container, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  getMachines,
  getMachinesLedesma,
  getBlocks,
  getBlocksLedesma,
  getDrivers,
  getSupervisors,
  getSupervisorsLedesma,
  getTrucks,
  getDireccionClientes,
  getNotasVenta,
  getClientesAgro,
  getProductos,
} from "../API/autocompleteData";
import { getUltimoRemito } from "../API/aonikenData";
import db from "../utils/db";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import { Send, Add } from "@mui/icons-material";
import { GlobalContext } from "../context/GlobalContext";
import EnviarTicketsModal from "./EnviarTicketsModal";
const HomeButtons = ({ deleteTickets, updateTickets }) => {
  const { context, setContext } = useContext(GlobalContext);
  const operation = localStorage.getItem("operation");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isAgro, setIsAgro] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    db.tickets.toArray().then((tickets) => {
      setTickets(tickets);
    });
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleNewTicket = () => {
    setContext({
      ...context,
      page: "settings",
    });
  };

  const handleSend = async () => {
    updateTickets();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDropdownClick = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleSync = async () => {
    handleClose();
    setLoading(true); // Abrir el modal
    try {
      await Promise.all([getTrucks(), getDrivers(),getMachinesLedesma(),
        getSupervisorsLedesma(),
        getBlocksLedesma(),
        getProductos(),
      ]);
    } catch (error) {
      console.error("Error sincronizando datos:", error);
    } finally {
      setTimeout(() => setLoading(false), 500); // Cerrar el modal con un pequeño retraso
    }
  };

  const handleSyncTabacal = async () => {
    handleClose();
    setLoading(true); // Abrir el modal
    try {
      await Promise.all([
        getMachines(),
        getSupervisors(),
        getBlocks(),
        getTrucks(),
        getDrivers(),
        getProductos(),
      ]);
    } catch (error) {
      console.error("Error sincronizando datos:", error);
    } finally {
      setTimeout(() => setLoading(false), 500); // Cerrar el modal con un pequeño retraso
    }
  };

  const handleSyncAgro = async (syncType) => {
    handleClose();
    setLoading(true); // Abrir el modal
    try {
      await Promise.all([
        getTrucks(),
        getDrivers(),
        getProductos(),
        syncType == "NV" ? getNotasVenta() : getClientesAgro(),
        syncType != "NV" && getDireccionClientes(),
        
      ]);
      db.trucks.toArray().then((trucks) => {
        trucks.forEach(async (truck) => await getUltimoRemito(truck.Patente));
      });
    } catch (error) {
      console.error("Error sincronizando datos:", error);
    } finally {
      setTimeout(() => setLoading(false), 10000);
    }
  };

  const handleDelete = async () => {
    deleteTickets()
    handleClose();
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",
        right: "16px",
        bottom: "16px",
      }}
    >
      <Box>
        <IconButton
          color="inherit"
          onClick={handleClickOpen}
          sx={{ marginLeft: 1 }}
        >
          <MenuIcon fontSize="large" color="primary" />
        </IconButton>
      </Box>
      <Box>
        {isOnline && tickets.length != 0 && (
          <IconButton onClick={() => handleSend()}>
            <SendIcon fontSize="large" color="primary" />
          </IconButton>
        )}

        <IconButton sx={{ marginLeft: 1 }} onClick={() => handleNewTicket()}>
          <AddIcon fontSize="large" color="primary" />
        </IconButton>
      </Box>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Opciones</DialogTitle>
        <List>
          <ListItem button onClick={handleDropdownClick}>
            <ListItemText primary="Sincronizar Datos" />
            {openDropdown ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openDropdown} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button onClick={handleSync}>
                <ListItemText sx={{marginLeft: 1}} primary="Ledesma" />
              </ListItem>
              <ListItem button onClick={handleSyncTabacal}>
                <ListItemText sx={{marginLeft: 1}} primary="Tabacal" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setIsAgro(true);
                  handleSyncAgro("NV");
                }}
              >
                <ListItemText sx={{marginLeft: 1}} primary="Agro Notas de Venta" />
              </ListItem>
              <ListItem
                button
                onClick={() => {
                  setIsAgro(true);
                  handleSyncAgro("clientes");
                }}
              >
                <ListItemText sx={{marginLeft: 1}} primary="Agro Clientes" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={handleDelete}>
            <ListItemText primary="Eiliminar Tickets" />
          </ListItem>
        </List>
        <DialogActions style={{ justifyContent: "flex-start" }}>
          <Button onClick={handleClose} color="primary">
            CERRAR
          </Button>
        </DialogActions>
      </Dialog>
      <EnviarTicketsModal isOpen={loading} />
    </Container>
  );
};

export default HomeButtons;
