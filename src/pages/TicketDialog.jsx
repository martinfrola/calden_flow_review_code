import React, { useContext, useEffect, useState } from "react";
import CamScan from "../components/CamScan";
import Signature from "../components/steps/Signature";
import { GlobalContext } from "../context/GlobalContext";
import DetailAgro from "../components/steps/DetailAgro";
import TicketDetails from "../components/steps/TicketDetails";
export default function TicketDialog() {
  const { context, setContext } = useContext(GlobalContext);
  const [selectedMode, setSelectedMode] = useState({});
  const [selectedOperation, setSelectedOperation] = useState(null);
  useEffect(() => {
    const mode = localStorage.getItem("mode");
    const operation = localStorage.getItem("operation");
    if (mode !== "undefined") {
      setSelectedMode(JSON.parse(mode));
    }
    setSelectedOperation(JSON.parse(operation));
  }, [context]);
  return (
    <>
      {selectedMode == "QR" ? (
        <>
          {context.step === "step1" && <CamScan />}
          {context.step === "step2" && <Signature />}
          {context.step === "step3" && <TicketDetails />}
        </>
      ) : (
        <>
          {context.step === "step1" && <Signature />}
          {context.step === "step2" && <TicketDetails />}
                  </>
      )}
    </>
  );
}
