import React, { useContext, useEffect, useState } from "react";
import { Container, Typography, IconButton } from "@mui/material";
import { GlobalContext } from "../context/GlobalContext";
import acceptButton from "../utils/images/acceptButton.png";
import cancelButton from "../utils/images/cancelButton.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
export default function DialogButtons({ onNext, showBack, showNext }) {
  const { context, setContext } = useContext(GlobalContext);
  const [operation, setOperation] = useState(null);
  const [selectedMode, setSelectedMode] = useState({});

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    if (mode !== "undefined") {
      setSelectedMode(JSON.parse(mode));
    }

    const operation = localStorage.getItem("operation");
    if (operation !== "undefined") {
      setOperation(JSON.parse(operation));
    }
  }, []);

  const handleNext = async () => {
    const currentStepNumber = context.step.slice(-1);
    const nextStep = `step${parseInt(currentStepNumber) + 1}`;
    const mode = localStorage.getItem("mode");
    if (
      (selectedMode == "QR" && currentStepNumber == 2) ||
      (selectedMode != "QR" && currentStepNumber == 1)
    ) {
      onNext();
      const emiteTicket = localStorage.getItem("emiteTicket")
      if(operation.title == "Agro") {
        setContext({
          ...context,
          page: emiteTicket == "false" ? "agroDetail" : "detail",
          step: "step1",
        });
      } else {
        setContext({
          ...context,
          page: "detail",
          step: "step1",
        });
      }
      
    } else {
      onNext();
      setTimeout(() => {
        const firma = localStorage.getItem('firma');
          setContext({
            ...context,
            step: nextStep,
          });
      }, 500); // 1000 milisegundos equivalen a 1 segundo
    }
  };

  const handleBack = () => {
    const currentStepNumber = context.step.slice(-1);
    if (currentStepNumber === "1") {
      const page = operation.title == "Tabacal" ? "tabacalConfig" : "settings";
      setContext({
        ...context,
        page: page,
      });
    } else {
      const previousStep = `step${parseInt(currentStepNumber) - 1}`;
      setContext({
        ...context,
        step: previousStep,
      });
    }
  };

  return (
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
        <IconButton onClick={() => handleBack()} disabled={!showBack}>
          <ArrowBackIcon fontSize="large" color={showBack ? "primary" : ""} />
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
            handleNext();
          }}
          disabled={!showNext}
        >
          <ArrowForwardIcon
            fontSize="large"
            color={showNext ? "primary" : ""}
          />
        </IconButton>
      </Typography>
    </Container>
  );
}
