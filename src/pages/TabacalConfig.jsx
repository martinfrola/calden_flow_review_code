import React, { useEffect, useState, useContext } from "react";
import db from "../utils/db";
import { operations } from "../data/operationsClient";
import {
  Autocomplete,
  Box,
  TextField,
  DialogTitle,
  DialogContent,
  Container,
  Typography,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { GlobalContext } from "../context/GlobalContext";

const TabacalConfig = () => {
  const { context, setContext } = useContext(GlobalContext);
  const [blocks, setBlocks] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedOdometer, setSelectedOdometer] = useState("");
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedCuarteo, setSelectedCuarteo] = useState(false);
  const [productos, setProductos] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [formComplete, setFormComplete] = useState(true);
  const [selectedMode, setSelectedMode] = useState(null);
  const[operationMode, setOperationMode] =useState(null)

  useEffect(() => {
    // Check if all fields are completed
    const isFormComplete =
      selectedMachine &&
      selectedOdometer !== "" &&
      selectedOperation &&
      selectedBlock &&
      selectedSupervisor;
    setFormComplete(isFormComplete);
    
  }, [
    selectedMachine,
    selectedCuarteo,
    selectedOdometer,
    selectedOperation,
    selectedBlock,
    selectedSupervisor,
  ]);

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    setSelectedMode(JSON.parse(mode));
    const operation = localStorage.getItem("operation");
    const operationObject = JSON.parse(operation)
    setOperationMode(operationObject.title)
    if(operationObject.title === 'Tabacal') {
      setDataTabacal()
    } else {
      setDataLedesma()
      setSelectedOperation("Otra")
    }
  }, []);

  const setDataTabacal = () => {
     db.blocks.toArray().then((blocks) => {
      setBlocks(blocks);
    });
    db.machine.toArray().then((machines) => {
      setMachines(machines);
    });
    db.supervisors.toArray().then((supervisors) => {
      setSupervisors(supervisors);
    });
    db.productos.toArray().then((productos) => {
      setProductos(productos);
      const diesel500 = productos.filter((producto) => producto.DescripcionArticulo === "Diesel 500")
      console.log(diesel500)
      setSelectedProducto(diesel500[0])
    });
  }
  const setDataLedesma = () => {
     db.blocksLedesma.toArray().then((blocks) => {
      setBlocks(blocks);
    });
    db.machineLedesma.toArray().then((machines) => {
      setMachines(machines);
    });
    db.supervisorsLedesma.toArray().then((supervisors) => {
      setSupervisors(supervisors);
    });
  }

  const handleSave = async () => {
    localStorage.setItem("machine", selectedMachine.MaquinaID);
    localStorage.setItem("odometer", selectedOdometer);
    localStorage.setItem("tabacalOperation", selectedOperation.title);
    localStorage.setItem("bloqueID", selectedBlock.BloqueID);
    localStorage.setItem("bloqueDescripcion", selectedBlock.Descripcion);
    localStorage.setItem("supervisorLegajo", selectedSupervisor.Legajo);
    localStorage.setItem("cuarteo", selectedCuarteo);
    localStorage.setItem(
      "supervisorNombre",
      selectedSupervisor.NombreyApellido
    );
    if(operationMode == 'Tabacal') {
      localStorage.setItem("producto", JSON.stringify(selectedProducto))
    }

    setContext({
      ...context,
      page: "newTicket",
      step: "step1",
    });
    if (selectedMode !== "QR") {
      MyInterface.onButtonClick();
    }
  };

  const handleCancel = () => {
    setContext({
      ...context,
      page: "settings",
    });
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "0 auto" }}>
      <DialogTitle>Datos del despacho</DialogTitle>
      <DialogContent>
        <Autocomplete
          options={machines}
          getOptionLabel={(option) => option.Descripcion}
          value={selectedMachine}
          onChange={(event, newValue) => {
            setSelectedMachine(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Máquina" margin="normal" />
          )}
        />
        <TextField
          label="Horómetro"
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          value={selectedOdometer}
          sx={{ marginTop: 1, width: "100%" }}
          onChange={(event) => {
            setSelectedOdometer(event.target.value);
          }}
        />
        {operationMode == 'Tabacal' && 
          <Autocomplete
          options={operations}
          getOptionLabel={(option) => option.title}
          value={selectedOperation}
          onChange={(event, newValue) => {
            setSelectedOperation(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Operación" margin="normal" />
          )}
        />
        }
        
        {operationMode == 'Tabacal' && 
        <Autocomplete
        options={productos}
        getOptionLabel={(option) => `${option.DescripcionArticulo}`}
        value={selectedProducto}
        onChange={(event, value) => {
          setSelectedProducto(value);
        }}
        renderInput={(params) => <TextField {...params} label="Producto" margin="normal"/>}
      />
        }

        <Autocomplete
          options={blocks}
          getOptionLabel={(option) => option.Descripcion}
          value={selectedBlock}
          onChange={(event, newValue) => {
            setSelectedBlock(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Bloque" margin="normal" />
          )}
        />
        <Autocomplete
          options={supervisors}
          getOptionLabel={(option) => `${option.Descripcion}`}
          value={selectedSupervisor}
          onChange={(event, newValue) => {
            setSelectedSupervisor(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Supervisor" margin="normal" />
          )}
        />
        {operationMode == 'Tabacal' && 
          <FormControlLabel
          control={
            <Switch
              onChange={() => setSelectedCuarteo(!selectedCuarteo)}
              checked={selectedCuarteo}
            />
          }
          label="Cuarteo"
          />
        }
        
      </DialogContent>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          bottom: "20px",
          right: "0px",
        }}
      >
        <Typography
          sx={{
            marginRight: 2,
            "&:hover": {
              cursor: "pointer",
              opacity: 0.8,
            },
            width: "100%",
            textAlign: "left",
          }}
        >
          <IconButton onClick={() => handleCancel()}>
            <ArrowBackIcon fontSize="large" color="primary" />
          </IconButton>
        </Typography>
        <Typography
          sx={{
            "&:hover": {
              cursor: "pointer",
              opacity: 0.8,
            },
            width: "100%",
            textAlign: "right",
          }}
        >
          <IconButton
            onClick={() => {
              handleSave();
            }}
            disabled={!formComplete}
          >
            <ArrowForwardIcon
              fontSize="large"
              color={formComplete ? "primary" : ""}
            />
          </IconButton>
        </Typography>
      </Container>
    </Box>
  );
};

export default TabacalConfig;
