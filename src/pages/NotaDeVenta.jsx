import React, { useEffect, useState, useContext } from "react";
import {
  Autocomplete,
  TextField,
  Slide,
  Box,
  Container,
  Typography,
  IconButton,
  FormControlLabel,
  Switch
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ModalRemito from "../components/ModalRemito";
import db from "../utils/db";
import { GlobalContext } from "../context/GlobalContext";

export default function NotaDeVenta() {
  const { context, setContext } = useContext(GlobalContext);
  const [notasVenta, setNotasVenta] = useState([]);
  const [nvFiltradas,setNvFiltradas] = useState([])
  const [selectedNV, setSelectedNV] = useState(null);
  const [clientes, setClientes] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [productos, setProductos] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [direccionCliente, setDireccionCliente] = useState(null)
  const [direccionClienteFiltradas, setDireccionClienteFiltradas] = useState(null)
  const [selectedDir, setSelectedDir] = useState(null)
  const [cantidad, setCantidad] = useState("");
  const [visible, setVisible] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [disableNV, setDisabledNV] = useState(false);
  const [disableCliente, setDisabledCliente] = useState(false);
  const [disableProducto, setDisabledProducto] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [remito, setRemito] = useState("");
  const [acopio, setAcopio] = useState(false)
  const [openModalRemito, setOpenModalRemito] = useState(false);
  const [emiteTicket, setEmiteTicket] = useState(false)
  useEffect(() => {
    setVisible(true);

    db.notasVenta.toArray().then((nv) => {
      setNotasVenta(nv);
      const notasComunes= nv.filter(nv => nv.CodigoNotaVenta !== 'NVA')
      setNvFiltradas(notasComunes)
    });

    db.clientesAgro.toArray().then((clientes) => {
      setClientes(clientes);
    });
    db.productos.toArray().then((productos) => {
      setProductos(productos);
    });
    db.direccionClientes.toArray().then((direccion) => {
      setDireccionCliente(direccion);
      setDireccionClienteFiltradas(direccion)
    });
    const mode = localStorage.getItem("mode");
    setSelectedMode(JSON.parse(mode));

    const proximoRemito = localStorage.getItem("proximoRemito");

    const proximoRemitoObject = JSON.parse(proximoRemito);
    setRemito(proximoRemitoObject.remito);
    localStorage.setItem("emiteTicket", emiteTicket)
  }, [openModalRemito]);

  useEffect(() => {
    if (selectedNV != null && cantidad != "") {
      setNextEnabled(true);
    } else if (selectedCliente != null && selectedProducto != null && selectedDir != null) {
      setNextEnabled(true);
    } else {
      setNextEnabled(false);
    }
  }, [cantidad, selectedNV, selectedCliente, selectedProducto, selectedDir]);

  const handleNVChange = (event, value) => {
    setSelectedNV(value);
    if (value) {
      setCantidad(value.Litros);
      setSelectedCliente(null);
      setSelectedProducto(null);
      setDisabledCliente(true);
      setDisabledProducto(true);  
    } else {
      setCantidad("");
      setDisabledCliente(false);
      setDisabledProducto(false);
    }
  };
  const handleClienteChange = (event, value) => {
    setSelectedCliente(value);
    if (value) {
      const newDir = direccionCliente.filter(direcciones=> direcciones.NumeroCuenta == value.NumeroCuenta)
      console.log(newDir)
      setDireccionClienteFiltradas(newDir)
      setCantidad(value.Cantidad);
      setSelectedNV(null);
      setCantidad("");
      setDisabledNV(true);
    } else {
      setDireccionClienteFiltradas(direccionCliente)
      setSelectedProducto(null);
      setDisabledNV(false);
      setSelectedDir(null)
    }
  };

  const handleCancel = () => {
    setContext({
      ...context,
      page: "settings",
    });
  };

  const handleSave = () => {
    localStorage.setItem("emiteTicket", emiteTicket)
    if (selectedNV != null) {
      // const productoEncontrado = productos.find(
      //   (producto) =>
      //     producto.DescripcionArticulo !== selectedNV.DescripcionProducto
      // );

      // if (productoEncontrado) {
        selectedNV.CodigoProducto = selectedNV.ArticuloProducto;
      // }
      localStorage.setItem("notaVenta", JSON.stringify(selectedNV));
    } else {
      selectedCliente.CodigoProducto = selectedProducto.CodigoProducto;
      selectedCliente.DescripcionProducto =
        selectedProducto.DescripcionArticulo;
        selectedCliente.CodigoNotaVenta = null
        selectedCliente.NumeroNotaVenta = null
        selectedCliente.CodigoProvincia = selectedDir.CodigoJurisdiccion
        selectedCliente.Provincia = selectedDir.DescripcionJur
        selectedCliente.CodigoPostal = selectedDir.CodigoPostal
        selectedCliente.CodigoDireccionEntrega = selectedDir.CodigoEntrega
        selectedCliente.DireccionEntrega = selectedDir.Dirreccion
      localStorage.setItem("notaVenta", JSON.stringify(selectedCliente));
      localStorage.setItem("producto", JSON.stringify(selectedProducto));
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
const handleAcopio = ()=> {
  setAcopio(!acopio)
  if(!acopio === true) {
    const nvAcopio = notasVenta.filter(nv => nv.CodigoNotaVenta === 'NVA')
    setNvFiltradas(nvAcopio)
  }else {
    const nvAcopio = notasVenta.filter(nv => nv.CodigoNotaVenta !== 'NVA')
    setNvFiltradas(nvAcopio)
  } 
}
const handleSwitch = (e) => {
  setEmiteTicket(!emiteTicket)

  if (!emiteTicket) {
    setDisabledCliente(false);
    setDisabledProducto(false);
    setDisabledNV(true);
    setAcopio(false)
    setSelectedNV(null)
    setCantidad("")
  } else {
    setDisabledNV(false);
  }
}
  return (
    <Slide direction="left" in={visible}>
      {!openModalRemito ? (
        <Box sx={{ margin: "0 32px" }}>
          <Typography variant="h6" sx={{ textAlign: "center", marginY: 1 }}>
            Nota de Venta
          </Typography>
          
          <Autocomplete
            options={nvFiltradas}
            getOptionLabel={(option) =>
              `${option.CodigoNotaVenta}-${option.NumeroNotaVenta}: ${option.RazonSocialCliente} - ${option.Litros} litros`
            }
            value={selectedNV}
            onChange={handleNVChange}
            disabled={disableNV}
            sx={{ marginBottom: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Nota de Venta" />
            )}
          />
          <FormControlLabel
          control={
            <Switch
              onChange={() => {handleAcopio()}}
              checked={acopio}
              disabled={disableNV}  
            />
          }
          label="Nota de Venta de Acopio"
          />
          <TextField
            label="Cantidad"
            value={cantidad}
            disabled={true}
            onChange={(event) => setCantidad(event.target.value)}
            sx={{ width: "100%", marginBottom: 5, marginTop: 1 }}
          />
          <Autocomplete
            options={clientes}
            getOptionLabel={(option) => `${option.RazonSocialCliente}`}
            value={selectedCliente}
            onChange={handleClienteChange}
            disabled={disableCliente}
            sx={{ marginBottom: 3 }}
            renderInput={(params) => <TextField {...params} label="Cliente" />}
          />
          <Autocomplete
            options={direccionClienteFiltradas}
            getOptionLabel={(option) => `${option.Dirreccion}`}
            value={selectedDir}
            onChange={(event, value) => {
              setSelectedDir(value);
            }}
            disabled={disableProducto}
            sx={{ marginBottom: 3 }}
            renderInput={(params) => <TextField {...params} label="Direccion Cliente" />}
          />
          <Autocomplete
            options={productos}
            getOptionLabel={(option) => `${option.DescripcionArticulo}`}
            value={selectedProducto}
            onChange={(event, value) => {
              setSelectedProducto(value);
            }}
            disabled={disableProducto}
            sx={{ marginBottom: 3 }}
            renderInput={(params) => <TextField {...params} label="Producto" />}
          />
          <Box sx={{ width: "100%", marginBottom: 3 }}>
            <TextField
              label="Número de Remito"
              value={remito}
              disabled={true}
              sx={{ width: "80%" }}
            />
            <IconButton
              sx={{ width: "20%" }}
              onClick={() => setOpenModalRemito(true)}
            >
              <ModeEditIcon fontSize="large" color={"primary"} />
            </IconButton>
          </Box>

          <FormControlLabel 
              control={
                <Switch
                  onChange={(e) => {handleSwitch(e)}}
                  checked={emiteTicket}
                />
              }
              label="Emite Ticket"
              />

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
          text={"Escribá el número de remito correcto."}
        />
      )}
    </Slide>
  );
}
