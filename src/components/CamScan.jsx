import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Box,
  Button,
  DialogContent,
  DialogTitle,
  Typography,
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import DialogButtons from "./DialogButtons";
import { saveDispatch } from "../utils/tickets";
import { GlobalContext } from "../context/GlobalContext";
export default function CamScan() {
  const webcamRef = useRef(null);
  const intervalRef = useRef();
  const [active, setActive] = useState(true);
  const [codeProcessed, setCodeProcessed] = useState(false);
  const [qr, setQR] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const { context, setContext } = useContext(GlobalContext);
  const [selectedDeviceId, setSelectedDeviceId] = useState(() => {
    const savedCameraId = localStorage.getItem("selectedCameraId");
    return savedCameraId !== null ? savedCameraId : "";
  });

  useEffect(() => {
    getVideoDevices();
    intervalRef.current = setInterval(captureAndAnalyzeQR, 500);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleCameraChange = (e) => {
    const selectedDeviceId = e.target.value;
    setSelectedDeviceId(selectedDeviceId);
    localStorage.setItem("selectedCameraId", selectedDeviceId);
  };

  const getVideoDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(
      (device) => device.kind === "videoinput"
    );

    // Función para verificar si una cámara es la cámara trasera principal
    const isMainCamera = (device) => {
      const supportedConstraints =
        navigator.mediaDevices.getSupportedConstraints();
      if (
        supportedConstraints.facingMode &&
        typeof device.getCapabilities === "function"
      ) {
        const capabilities = device.getCapabilities();
        return (
          capabilities.facingMode &&
          (capabilities.facingMode.includes("environment") ||
            capabilities.facingMode.includes("rear"))
        );
      }
      return false;
    };

    // Filtrar las cámaras para obtener solo la cámara trasera principal
    const mainCamera = videoDevices.find(isMainCamera);

    // Si se encontró la cámara trasera principal, seleccionarla por defecto
    if (mainCamera) {
      setSelectedDeviceId(mainCamera.deviceId);
      localStorage.setItem("selectedCameraId", mainCamera.deviceId);
    } else if (videoDevices.length > 0) {
      setSelectedDeviceId(videoDevices[0].deviceId);
      localStorage.setItem("selectedCameraId", videoDevices[0].deviceId);
    }

    setVideoDevices(videoDevices);
  };

  const decodeQRFromImage = (imageData) => {
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
      setCodeProcessed(true);
      const translations = {
        "TIME START": "Inicio =",
        "INICIO TIEMPO": "Inicio =",
        "TIME END": "Fin =",
        "FIN DE TIEMPO": "Fin =",
        "END GROSS COUNT": "Estado Final =",
        "FIN DE CONTEO": "Estado Final =",
        "START COUNT": "Estado Inicial =",
        "INICIO CONTEO": "Estado Inicial =",
        "START TOTALIZER": "Inicio Totalizador =",
        "INICIO TOTALIZ.": "Inicio Totalizador =",
        "END TOTALIZER": "Fin Totalizador =",
        "FIN TOTALIZADOR": "Fin Totalizador =",
        LITRES: "litros",
        LITROS: "litros",
        START: "Inicio =",
        INICIO: "Inicio =",
        FINISH: "Fin =",
        FIN: "Fin =",
        "GROSS DELIVERY": "Entrega Bruta =",
        "ENTREGA BRUTO": "Entrega Bruta =",
        GASOLINE: "Combustible =",
        GASOLINA: "Combustible =",
        "SALE NUMBER": "Número de venta =",
        "NUMERO DE VENTA": "Número de venta =",
      };

      let translatedQr = code.data;

      for (let key in translations) {
        const regex = new RegExp(key, "g");
        translatedQr = translatedQr.replace(regex, translations[key]);
      } 
      setQR(translatedQr.split("\n"));
      setActive(false);
    }
  };

  const captureAndAnalyzeQR = () => {
    if (!codeProcessed && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        decodeQRFromImage(imageData);
      };
    }
  };
  const videoConstraints = {
    deviceId: selectedDeviceId,
  };

  const handleNext = () => {
    const inicio = localStorage.getItem("Inicio");
    const fin = localStorage.getItem("Fin");
    const inicioTotalizador = localStorage.getItem("Inicio Totalizador");
    const entregaBruta = localStorage.getItem("Entrega Bruta");
    saveDispatch(parseFloat(entregaBruta), inicio, fin, inicioTotalizador);
  };
  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      {active && (
        <Box sx={{ mt: "16px" }}>
          <Webcam
            audio={false}
            ref={webcamRef}
            style={{ width: "100%" }}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        </Box>
      )}
      {qr == null && (
        <FormControl sx={{ marginTop: 3, width: 300 }}>
          <InputLabel id="select-camera-label">
            Seleccione una cámara
          </InputLabel>
          <Select
            variant="standard"
            labelId="select-camera-label"
            value={
              videoDevices.find(
                (device) => device.deviceId === selectedDeviceId
              ) || ""
            }
            onChange={(event) => {
              const newValue = event.target.value;
              if (newValue) {
                handleCameraChange({ target: { value: newValue.deviceId } });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Seleccione una cámara"
                variant="outlined"
              />
            )}
          >
            {videoDevices.map((device) => (
              <MenuItem key={device.deviceId} value={device}>
                {device.label || `Cámara ${device.deviceId}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {qr !== null && (
        <DialogContent>
          <DialogTitle>Datos del despacho</DialogTitle>
          {qr.map((item, index) => {
            const parts = item.split("=", 2);
            if (parts.length < 2) {
              return null;
            }
            const [label, value] = parts;
            localStorage.setItem(label.trim(), value.trim());
            return (
              <Typography key={index}>
                <b>{label}</b> : {value}
              </Typography>
            );
          })}
        </DialogContent>
      )}
      <DialogButtons
        onNext={() => {
          handleNext();
        }}
        showBack={qr == null}
        showNext={qr !== null}
      />
    </Box>
  );
}
