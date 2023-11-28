import React, { createContext, useState } from "react";

// Crea el contexto
export const GlobalContext = createContext();
// Crea el proveedor del contexto
export const GlobalContextProvider = ({ children }) => {
  const [context, setContext] = useState({
    page: "home",
    step: "step1",
  });

  return (
    <GlobalContext.Provider value={{ context, setContext }}>
      {children}
    </GlobalContext.Provider>
  );
};
