import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const ModalRemito = ({ open, onClose, text, remitoActual }) => {
  const [inputValue, setInputValue] = useState("");

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    if (inputValue) {
      const truck = localStorage.getItem("truck");
      const truckObject = JSON.parse(truck);
      localStorage.setItem(
        "proximoRemito",
        JSON.stringify({
          patente: truckObject.Patente,
          remito: remitoActual ? parseInt(inputValue) - 1 : inputValue,
        })
      );
      handleClose();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      height="100vh"
      px={2}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" align="center" sx={{ marginBottom: 3 }}>
          Número de Remito
        </Typography>
        <Typography sx={{ marginBottom: 2, textAlign: "center", paddingX: 1 }}>
          {text}
        </Typography>

        <TextField
          label="Numero de Remito"
          type="number"
          value={inputValue}
          onChange={handleInputChange}
        />
      </Box>

      <Box display="flex" width="100%" justifyContent="flex-end">
        <Button onClick={handleClose}>Cerrar</Button>
        <Button onClick={handleSave} disabled={!inputValue}>
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default ModalRemito;
