import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { GlobalContext } from "../context/GlobalContext";
import { Menu as MenuIcon } from "@mui/icons-material";
import {
  getMachines,
  getBlocks,
  getDrivers,
  getSupervisors,
  getTrucks,
} from "../API/autocompleteData";
import db from "../utils/db";
import LogoCaldenFlow from "../utils/images/logo_calden_flow.png";
const Nav = () => {
  const { context, setContext } = useContext(GlobalContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleSync = async () => {
    await getBlocks();
    await getDrivers();
    await getMachines();
    await getSupervisors();
    await getTrucks();
    handleMenuClose();
  };
  const handleDelete = async () => {
    const tickets = await db.tickets.toArray();
    const deletePromises = tickets
      .filter((ticket) => ticket.sent)
      .map((ticket) => db.tickets.delete(ticket.id));
    await Promise.all(deletePromises);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        marginBottom: 3,
        "@media print": {
          display: "none",
        },
      }}
    >
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img src={LogoCaldenFlow} alt="Logo CaldenFlow" width="170px" />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Nav;
