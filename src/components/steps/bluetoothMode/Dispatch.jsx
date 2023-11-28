import React, { useState, useEffect } from "react";
import { Typography, Box, DialogContent, DialogTitle } from "@mui/material";
import DialogButtons from "../../DialogButtons";
import { saveDispatch } from "../../../utils/tickets";

function getRandomTime() {
  return Math.floor(Math.random() * (2000 - 700 + 1)) + 900;
}

const Dispatch = () => {
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(true);
  const [preset, setPreset] = useState(0);
  const [showBack, setShowBack] = useState(true);
  const [showNext, setShowNext] = useState(false);
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [currentTime, setCurrentTime] = useState(getRandomTime());
  useEffect(() => {
    const presetValue = localStorage.getItem("preset");
    if (presetValue !== "undefined") {
      setPreset(parseFloat(JSON.parse(presetValue)));
    }

    if (inicio === "" || !paused) {
      setInicio(getDate());
    } else {
      setFin(getDate());
      setShowNext(true);
    }
    let intervalId;
    if (!paused) {
      setShowBack(false);

      intervalId = setInterval(() => {
        setCount((prevCount) => {
          setShowNext(false);
          if (prevCount < preset || parseFloat(JSON.parse(presetValue)) == 0) {
            return prevCount + 1;
          } else {
            setPaused(true);
            setFin(getDate());
            return prevCount;
          }
        });
        setCurrentTime(getRandomTime());
      }, currentTime);
    }

    return () => clearInterval(intervalId);
  }, [paused, currentTime]);

  const handleTextClick = () => {
    setPaused((prevPaused) => !prevPaused);
  };
  const getDate = () => {
    const currentDate = new Date();
    const dateString = `${currentDate.getDate().toString().padStart(2, "0")}/${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${currentDate
      .getFullYear()
      .toString()
      .substring(2)} ${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    return dateString;
  };
  const onNext = async () => {
    const finalDispatch = count.toFixed(1);
    localStorage.setItem("dispatched", JSON.stringify(finalDispatch));
    saveDispatch(parseFloat(finalDispatch), inicio, fin, 2637);
  };

  return (
    <Box>
      <DialogTitle>Despacho de combustible</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: paused ? "2px solid black" : "2px solid blue",
            borderRadius: "50%",
            width: "fit-content",
            marginTop: 5,
            height: "200px",
            width: "200px",
          }}
          onClick={handleTextClick}
        >
          <Typography
            variant="h2"
            sx={{ color: paused ? "initial" : "primary.main" }}
          >
            {count}
          </Typography>
        </Box>
        <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
          {paused
            ? "Toque para iniciar despacho."
            : "Toque para pausar despacho."}
        </Typography>
        <Typography>Pulsar siguiente para finalizar el despacho.</Typography>
        <DialogButtons
          onNext={onNext}
          showBack={showBack}
          showNext={showNext}
        />
      </DialogContent>
    </Box>
  );
};

export default Dispatch;
