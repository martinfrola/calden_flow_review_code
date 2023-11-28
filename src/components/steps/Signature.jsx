import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Checkbox,
  Box,
  FormControlLabel
} from "@mui/material";
import { GlobalContext } from "../../context/GlobalContext";
import SignatureCanvas from "react-signature-canvas";
import DialogButtons from "../DialogButtons";
import Detail from "../Detail";
import db from "../../utils/db";
import {
  saveDispatchBluetooth,
  searchForTotalizer,
  getDate,
} from "../../utils/tickets";

export default function Signature() {
  const { context, setContext } = useContext(GlobalContext);
  const [firma, setFirma] = useState("");
  const [signatureExists, setSignatureExists] = useState(false);
  const signatureRef = useRef();
  const [selectedMode, setSelectedMode] = useState({});
  const [truck, setTruck] = useState(null)
  const [entregaBruta, setEntregaBruta] = useState(null);
  const [numeroVenta, setNumeroVenta] = useState(null);
  const [totalizadorFinal, setTotalizadorFinal] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [notaVenta, setNotaVenta] = useState(null);
  const [showNext, setShowNext] = useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [operationMode, setOperationMode] =useState("")
  const [aclaracion, setAclaracion] =useState("")
  const [pruebaAgua, setPruebaAgua] =useState(false)

  useEffect(() => {
    const truckString = localStorage.getItem("truck");
    const truckObject = JSON.parse(truckString);

    const operationString = localStorage.getItem("operation");
    const operationObject = JSON.parse(operationString);
    setOperationMode(operationObject.title)

    setTruck(truckObject)
    const mode = localStorage.getItem("mode");
    const notaVenta = localStorage.getItem("notaVenta");
    if (notaVenta != undefined) {
      setNotaVenta(notaVenta);
    }
    if (JSON.parse(mode) != "QR") {
      MyInterface.sendDataToJavascript();
    }

    if (mode !== "undefined") {
      setSelectedMode(JSON.parse(mode));
    }
  }, []);

  useEffect(() => { 
    console.log(aclaracion, pruebaAgua)
    if(aclaracion !== "" && firma !== "" && pruebaAgua === true) {
      setShowNext(true)
    } else {
      setShowNext(false)
    }
    if(operationMode !== "Agro" && firma !== "") {
      setShowNext(true)
    }
  }, [aclaracion, pruebaAgua, firma])

  const updateFirma = async (newFirma) => {
    localStorage.setItem("firma", newFirma);
    if (selectedMode == "QR") {
      const id = localStorage.getItem("idTicket");
      const ticket = await db.tickets.get({ id: id });
      ticket.firma = newFirma;
      if (notaVenta != null) {
        const proximoRemito = localStorage.getItem("proximoRemito");
        let proximoRemitoObject;
        if (proximoRemito != null) {
          proximoRemitoObject = JSON.parse(proximoRemito);
        } else {
          proximoRemitoObject = { remito: 0 };
        }
        const notaVentaObject = JSON.parse(notaVenta);
        ticket.notaVenta = notaVenta;
        ticket.numeroCuenta = notaVentaObject.NumeroCuenta
        ticket.numeroSubcuenta = notaVentaObject.NumeroSubCuenta
        ticket.codigoEntrega = notaVentaObject.CodigoDireccionEntrega
        ticket.codigoPostal = notaVentaObject.CodigoPostal
        ticket.codigoProvincia = notaVentaObject.CodigoProvincia
        ticket.cuit = notaVentaObject.CUITCliente
        ticket.codigoNotaVenta = notaVentaObject.CodigoNotaVenta
        ticket.numeroNotaVenta = notaVentaObject.NumeroNotaVenta
      }
      await db.tickets.put(ticket);
    } else {
      const value = MyInterface.sendDataToJavascript();
      const [
        entregaBrutaStr,
        numeroVentaStr,
        totalizadorFinalStr,
        fechaInicio,
        horaFinStr,
      ] = value.split("_");
      const entregaBruta = parseFloat(entregaBrutaStr.replace(",", "."));
      const numeroVenta = parseFloat(numeroVentaStr);
      const totalizadorFinal = parseFloat(
        totalizadorFinalStr.replace(",", ".")
      );
      
        if(entregaBrutaStr == "null") {
          localStorage.setItem("mode", JSON.stringify("QR"))
          setContext({
            ...context,
            page: "newTicket",
            step: "step1",
          });
          alert("Hubo un error al recuperar los datos del despacho. Escanee el código QR para continuar.")
        }
      // Extraemos la fecha y hora de inicio
      const [fecha, horaInicio] = fechaInicio.split(" ");
      let fechaHoraFin = "";
      // Comparamos las horas
      if (horaFinStr < horaInicio) {
        // Si la hora de fin es menor que la hora de inicio, sumamos un día a la fecha de inicio
        const fechaObj = new Date(`20${fecha} ${horaInicio}`);
        fechaObj.setDate(fechaObj.getDate() + 1);

        const fechaFin = fechaObj
          .toISOString()
          .split("T")[0]
          .split("-")
          .reverse()
          .join("/");
        fechaHoraFin = `${fechaFin} ${horaFinStr}`;
      } else {
        fechaHoraFin = `${fecha} ${horaFinStr}`;
      }
      setEntregaBruta(entregaBruta);
      setNumeroVenta(numeroVenta);
      setTotalizadorFinal(totalizadorFinal);
      setFechaInicio(fechaInicio);
      setFechaFin(fechaHoraFin);
    }
  };

  const onNext = async () => {
    if (selectedMode !== "QR") {
        saveDispatchBluetooth(
            entregaBruta,
            numeroVenta,
            fechaInicio,
            fechaFin,
            totalizadorFinal,
            notaVenta
        );
    } else {
      localStorage.setItem('aclaracion', aclaracion)

        const id = localStorage.getItem("idTicket");
        const ticket = await db.tickets.get({ id: id });
        if (ticket) {
            // El ticket existe, proceder a actualizar
            await db.tickets.update(id, { aclaracion: aclaracion });
            ticket.aclaracion = aclaracion;
        } else {
            // El ticket no existe
            console.log('No se encontró el ticket con el id:', id);
        }
    }
};

  const handleChangeCheck = (event) => {
    setPruebaAgua(event.target.checked);
  };

  return (
    <>
      <DialogTitle sx={{ paddingY: 0 }}>Firma del supervisor</DialogTitle>
      <DialogContent>
        {/* <Detail /> */}
        <div>
          {firma ? (
            <img
              src={firma}
              alt="Signature"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setFirma("");
                setSignatureExists(false);
                localStorage.removeItem("signature");
              }}
            />
          ) : (
            <SignatureCanvas
              penColor="black"
              canvasProps={{
                width: 325,
                height: 300,
                style: { border: "1px solid black" },
              }}
              ref={(ref) => (signatureRef.current = ref)}
              onEnd={() => {
                const signatureDataURL = signatureRef.current.toDataURL();
                if (signatureDataURL) {
                  setSignatureExists(true);
                  setFirma(signatureDataURL);
                  updateFirma(signatureDataURL);
                } else {
                  setSignatureExists(false);
                }
              }}
            />
          )}
        </div>
        {operationMode == 'Agro' &&
          <TextField
            label="Aclaración"
            InputProps={{
              inputProps: {
                maxLength: 50
              }
            }}
            value={aclaracion}
            sx={{ marginTop: 1, width: "100%" }}
            onChange={(event) => {
              setAclaracion(event.target.value);
            }}
          />
        }
        {operationMode == 'Agro' &&
        <Box sx={{marginTop: 5}}>
        <FormControlLabel
        sx={{display: 'flex', alignItems: 'start'}}
          control={
            <Checkbox
              checked={pruebaAgua}
              onChange={handleChangeCheck}
              name="pruebaAgua"
              color="primary"
            />
          }
          label="Se da conformidad que se ha realizado satisfactoriamente la prueba de contenido de agua."
        />
      </Box>
        }
        
      </DialogContent>
      <DialogButtons onNext={onNext} showBack={false} showNext={showNext} />
    </>
  );
}
