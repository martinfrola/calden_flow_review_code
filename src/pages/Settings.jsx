import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Container,
  FormControlLabel,
  Switch,
  Autocomplete,
  TextField,
  Typography,
  IconButton,
  Slide,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import db from "../utils/db";
import { getDate } from "../utils/tickets";
import { operations } from "../data/operations";
import { GlobalContext } from "../context/GlobalContext";
import { v4 as uuidv4 } from "uuid";
import ModalRemito from "../components/ModalRemito";

const Settings = () => {
  const { context, setContext } = useContext(GlobalContext);
  const [drivers, setDrivers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [visible, setVisible] = useState(false);
  const [selectedBackupEnabled, setSelectedBackupEnabled] = useState(false);
  const [formComplete, setFormComplete] = useState({
    driver: false,
    truck: false,
    operation: false,
  });
  const [nextEnabled, setNextEnabled] = useState(false);
  const [openModalRemito, setOpenModalRemito] = useState(false);

  useEffect(() => {
    // Check if all fields are completed
    const isFormComplete =
      formComplete.driver && formComplete.truck && formComplete.operation;
    console.log(isFormComplete, selectedDriver, selectedTruck);
    setNextEnabled(isFormComplete);
  }, [formComplete]);

  const handleCancel = () => {
    setContext({
      ...context,
      page: "home",
    });
  };

  useEffect(() => {
    setVisible(true);
    db.drivers.toArray().then((drivers) => {
      setDrivers(drivers);
    });
    db.trucks.toArray().then((trucks) => {
      setTrucks(trucks);
    });
    db.productos.toArray().then((productos) => {
      const diesel500 = productos.filter((producto) => producto.DescripcionArticulo === "Diesel 500")
      localStorage.setItem("producto", JSON.stringify(diesel500[0]))
      setSelectedProducto(diesel500[0])
    });

    const driver = localStorage.getItem("driver");
    const truck = localStorage.getItem("truck");
    const operation = localStorage.getItem("operation");
    const backupEnabled = localStorage.getItem("backupEnabled");
    const backup = localStorage.getItem("backup");
    const mode = localStorage.getItem("mode");

    if (driver !== null) {
      setSelectedDriver(JSON.parse(driver));
      setFormComplete((prevFormComplete) => ({
        ...prevFormComplete,
        driver: true,
      }));
    }

    if (truck !== null) {
      setSelectedTruck(JSON.parse(truck));
      setFormComplete((prevFormComplete) => ({
        ...prevFormComplete,
        truck: true,
      }));
    }

    if (operation !== null) {
      setSelectedOperation(JSON.parse(operation));
      setFormComplete((prevFormComplete) => ({
        ...prevFormComplete,
        operation: true,
      }));
    }

    if (backupEnabled !== null) {
      setSelectedBackupEnabled(JSON.parse(backupEnabled));
    }

    if (backup !== null) {
      setSelectedBackup(JSON.parse(backup));
    }

    if (mode !== null) {
      setSelectedMode(JSON.parse(mode));
    }
  }, []);

  const handleSave = async () => {
    localStorage.setItem("driver", JSON.stringify(selectedDriver));
    localStorage.setItem("truck", JSON.stringify(selectedTruck));
    localStorage.setItem("operation", JSON.stringify(selectedOperation));
    localStorage.setItem(
      "backupEnabled",
      JSON.stringify(selectedBackupEnabled)
    );
    localStorage.setItem("fechaIncio", getDate());
    localStorage.setItem("backup", JSON.stringify(selectedBackup));
    localStorage.setItem("mode", JSON.stringify(selectedMode));
    
    if (selectedMode != "QR") {
      window.MyInterface.saveConnection(`LCRIQ-${selectedTruck.Patente}`);
    }

    if (selectedOperation.title === "undefined") {
      alert("faltan configuraciones");
    } else {
      if (selectedOperation.title == "Agro") {
        const existeRemito = await buscarUltimoRemito();
        if (existeRemito == 0) {
          setOpenModalRemito(true);
        } else {
          setContext({
            ...context,
            page: "agroConfig",
          });
        }
      } else if (selectedOperation.title == "Tabacal" || selectedOperation.title == "Ledesma Capilar") {
         setContext({
          ...context,
          page: "tabacalConfig",
        });
      } else {
        if (selectedMode == "QR") {
          setContext({
            ...context,
            page: "newTicket",
          });
        } else {
          MyInterface.onButtonClick();
          setContext({
            ...context,
            page: "newTicket",
          });
        }
      }
    }
  };

  const buscarUltimoRemito = async () => {
    const proximoRemito = localStorage.getItem("proximoRemito");

    if (proximoRemito == null) {
      const ultimoRemitoGuardado = await db.ultimosRemitos.get(
        selectedTruck.Patente
      );
      if (ultimoRemitoGuardado != null) {
        localStorage.setItem(
          "proximoRemito",
          JSON.stringify({
            patente: selectedTruck.Patente,
            remito: parseInt(ultimoRemitoGuardado.remito) + 1,
          })
        );
      } else {
        return 0;
      }
    } else {
      const proximoRemitoObject = JSON.parse(proximoRemito);
      if (proximoRemitoObject.patente !== selectedTruck.Patente) {
        const ultimoRemitoGuardado = await db.ultimosRemitos.get({
          id: selectedTruck.Patente,
        });
        if (ultimoRemitoGuardado != null) {
          localStorage.setItem(
            "proximoRemito",
            JSON.stringify({
              patente: selectedTruck.Patente,
              remito: parseInt(ultimoRemitoGuardado.remito) + 1,
            })
          );
        } else {
          return 0;
        }
      }
    }
  };

  const options = ["QR", "Bluetooth"];

  return (
    <Slide direction="left" in={visible}>
      {!openModalRemito ? (
        <Box sx={{ margin: "0 32px" }}>
          <Autocomplete
            value={selectedDriver}
            onChange={(event, newValue) => {
              setSelectedDriver(newValue);
              setFormComplete((prevFormComplete) => ({
                ...prevFormComplete,
                driver: true,
              }));
            }}
            options={drivers}
            getOptionLabel={(option) => option.Nombre}
            renderInput={(params) => (
              <TextField {...params} label="Chofer" margin="normal" />
            )}
          />

          <Autocomplete
            value={selectedTruck}
            onChange={(event, newValue) => {
              setSelectedTruck(newValue);
              setFormComplete((prevFormComplete) => ({
                ...prevFormComplete,
                truck: true,
              }));
            }}
            options={trucks}
            getOptionLabel={(option) => option.Patente}
            renderInput={(params) => (
              <TextField {...params} label="Camión" margin="normal" />
            )}
          />

          <Autocomplete
            value={selectedOperation}
            onChange={(event, newValue) => {
              setSelectedOperation(newValue);
              setFormComplete((prevFormComplete) => ({
                ...prevFormComplete,
                operation: true,
              }));
            }}
            options={operations}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField {...params} label="Operación" margin="normal" />
            )}
          />
          <Autocomplete
            value={selectedMode}
            onChange={(event, newValue) => {
              setSelectedMode(newValue);
            }}
            options={options}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Modo" margin="normal" />
            )}
          />

          <FormControlLabel
            control={
              <Switch
                onChange={() =>
                  setSelectedBackupEnabled(!selectedBackupEnabled)
                }
                checked={selectedBackupEnabled}
              />
            }
            label="Auxilio"
          />

          {selectedBackupEnabled && (
            <Autocomplete
              value={selectedBackup}
              onChange={(event, newValue) => {
                setSelectedBackup(newValue);
              }}
              options={trucks}
              getOptionLabel={(option) => option.Patente}
              renderInput={(params) => (
                <TextField {...params} label="Auxilio" margin="normal" />
              )}
            />
          )}

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
                disabled={!nextEnabled}
              >
                <ArrowForwardIcon
                  fontSize="large"
                  color={nextEnabled ? "primary" : ""}
                />
              </IconButton>
            </Typography>
          </Container>
        </Box>
      ) : (
        <ModalRemito
          open={openModalRemito}
          onClose={() => setOpenModalRemito(false)}
          text={
            "No se pudo recuperar el número de remito. Puede volver a sincronizar los maestros o escribirlo manualmente el próximo número de remito."
          }
        />
      )}
    </Slide>
  );
};

export default Settings;
