import React from "react";
import { Dialog, CircularProgress, Typography } from "@mui/material";

const EnviarTicketsModal = ({ isOpen }) => {
  return (
    <Dialog open={isOpen}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px",
        }}
      >
        <CircularProgress size={24} style={{ marginRight: "16px" }} />
        <Typography>Procesando</Typography>
      </div>
    </Dialog>
  );
};

export default EnviarTicketsModal;
