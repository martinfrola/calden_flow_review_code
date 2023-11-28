import axios from "axios";
import db from "../utils/db";
import { v4 as uuidv4 } from "uuid"; 
export const enviarDatosAok = (data) => {
  fetch(
    "https://apisaoniken.azure-api.net/CaldenFlow/metrics?subscription-key=13c152e1db6d4716842483a0bfe47e32",

    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
};

export const saveTicket = (data) => {
  const firma = data.firma
  data.firma = "";
  data.obs = "ok";
  if (data.notaVenta !== undefined) {
    data.notaVenta = JSON.parse(data.notaVenta);
  }

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout exceeded"));
    }, 10000); // 10 segundos en milisegundos
  });

  const fetchPromise = fetch(
    "https://apisaoniken.azure-api.net/CaldenFlow/metrics?subscription-key=13c152e1db6d4716842483a0bfe47e32",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  ).then(async (res) => {
    data.sent = res.ok;
    data.firma = firma
    if (data.notaVenta !== undefined) {
    data.notaVenta = JSON.stringify(data.notaVenta);
  }
    await db.tickets.put(data);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
};

export const saveMetricas = (data) => {
  const truckString = localStorage.getItem("truck");
  const truckObject = JSON.parse(truckString);

  const driverString = localStorage.getItem("driver");
  const driverObject = JSON.parse(driverString);

  data.patente = truckObject.Patente
  data.chofer = driverObject.Nombre
  data.id = uuidv4()
  
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Timeout exceeded"));
    }, 10000); // 10 segundos en milisegundos
  });

  const fetchPromise = fetch(
    "https://apisaoniken.azure-api.net/CaldenFlow/ModificacionDespacho?subscription-key=13c152e1db6d4716842483a0bfe47e32",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )

  return Promise.race([fetchPromise, timeoutPromise]);
}

export const getUltimoRemito = async (patente) => {
  const res = await axios.get(
    `https://apisaoniken.azure-api.net/CaldenFlow/tickets?subscription-key=13c152e1db6d4716842483a0bfe47e32&patente=${patente}&numeroVenta=0`
  );
  console.log(res.data.value);
  // Ordenar el array por el campo remito en orden descendente
  res.data.value.sort((a, b) => {
    let remitoA = 0;
    let remitoB = 0;
    if (a.remito && typeof a.remito === 'string') {
      remitoA = a.remito.split('-')[1]; // Extraer el número después del guion
    }
    if (b.remito && typeof b.remito === 'string') {
      remitoB = b.remito.split('-')[1]; // Extraer el número después del guion
    }
    return remitoB - remitoA;
  });
  console.log(res.data.value[0]);
  if (res.data.value[0] != undefined) {
    const ultimoTicket = res.data.value[0];
    if (ultimoTicket.remito && typeof ultimoTicket.remito === 'string') {
      const remitoNumber = ultimoTicket.remito.split('-')[1]; // Extraer el número después del guion
      await db.ultimosRemitos.put({
        id: patente,
        patente,
        remito: remitoNumber,
      });
    }
  }
};


