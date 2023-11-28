import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Box,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import DialogButtons from "../../DialogButtons";
const Preset = () => {
  const [preset, setPreset] = useState(0);

  useEffect(() => {
    const presetValue = localStorage.getItem("preset");
    if (presetValue !== null) {
      setPreset(parseFloat(JSON.parse(presetValue)));
    }
  }, []);

  const handlePresetChange = (event) => {
    setPreset(event.target.value);
  };

  const onNext = () => {
    localStorage.setItem("preset", JSON.stringify(preset));
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto", paddingX: 3 }}>
      <DialogTitle>Preset del caudalímetro</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          type="number"
          value={preset}
          onChange={handlePresetChange}
          fullWidth
          sx={{
            marginTop: 5,
            height: "70px",
            textAlign: "center",
            fontSize: "20px",
          }}
        />
        <Typography variant="body2" align="center">
          Si el preset está en 0 el despacho será manual
        </Typography>
        <DialogButtons onNext={onNext} showBack={true} showNext={true} />
      </DialogContent>
    </Box>
  );
};

export default Preset;
