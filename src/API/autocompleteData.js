import db from "../utils/db";
import axios from "axios";
import { blocks } from "../data/blocks";
import { supervisors } from "../data/supervisors";
import { machines } from "../data/machines";
import { drivers } from "../data/drivers";
import { trucks } from "../data/trucks";
export const getMachinesLedesma = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getVehiculosLedesma", {})
    .then(async (response) => {
      const data = response.data;
      await db.machineLedesma.clear();
      await db.machineLedesma.bulkAdd(data);
      console.log("Actualización en machines");
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};
export const getSupervisorsLedesma = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getPersonalLedesma", {})
    .then(async (response) => {
      const data = response.data;
      await db.supervisorsLedesma.clear();
      await db.supervisorsLedesma.bulkAdd(data);
      console.log("Actualización en machines");
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};
export const getBlocksLedesma = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getBloquesLedesma", {})
    .then(async (response) => {
      const data = response.data;
      await db.blocksLedesma.clear();
      await db.blocksLedesma.bulkAdd(data);
      console.log("Actualización en machines");
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};
export const getMachines = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getVehiculos", {})
    .then(async (response) => {
      const data = response.data;
      await db.machine.clear();
      await db.machine.bulkAdd(data);
      console.log("Actualización en machines");
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};

export const getSupervisors = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getPersonal", {})
    .then(async (response) => {
      const data = response.data;
      await db.supervisors.clear();
      await db.supervisors.bulkAdd(data);
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};

export const getBlocks = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getBloques", {
      timeout: 5000, // Establece un tiempo de espera de 5 segundos (5000 ms)
    })
    .then(async (response) => {
      const data = response.data;
      await db.blocks.clear();
      await db.blocks.bulkAdd(data);
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};

export const getDrivers = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getChoferesCamionCisterna", {
      timeout: 5000, // Establece un tiempo de espera de 5 segundos (5000 ms)
    })
    .then(async (response) => {
      const data = response.data;

      // Buscar registro existente en la tabla "dataFetching" con el nombre "drivers" en el campo "table"
      const existingRecord = await db.dataFetching
        .where({ table: "drivers" })
        .first();

      if (existingRecord) {
        // Reemplazar los datos existentes con los nuevos datos
        await db.drivers.clear();
        await db.drivers.bulkAdd(data);
        await db.dataFetching.update(existingRecord.id, { date: new Date() });
      } else {
        // No se encontró ningún registro existente, agregar los nuevos datos
        await db.drivers.bulkAdd(data);
        await db.dataFetching.add({ table: "drivers", date: new Date() });
      }
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};

export const getTrucks = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getCamiones", {
      timeout: 5000, // Establece un tiempo de espera de 5 segundos (5000 ms)
    })
    .then(async (response) => {
      const data = response.data;

      await db.trucks.clear();
      await db.trucks.bulkAdd(data);
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};

export const getNotasVenta = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getNV", {
      timeout: 5000, // Establece un tiempo de espera de 5 segundos (5000 ms)
    })
    .then(async (response) => {
      const data = response.data;

      await db.notasVenta.clear();
      await db.notasVenta.bulkAdd(data);
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};

export const getClientesAgro = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getClientesAgro", {
      timeout: 5000, // Establece un tiempo de espera de 5 segundos (5000 ms)
    })
    .then(async (response) => {
      const data = response.data;

      await db.clientesAgro.clear();
      await db.clientesAgro.bulkAdd(data);
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};
export const getProductos = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getProductos", {
      timeout: 5000, // Establece un tiempo de espera de 5 segundos (5000 ms)
    })
    .then(async (response) => {
      const data = response.data;

      await db.productos.clear();
      await db.productos.bulkAdd(data);
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};
export const getDireccionClientes = async () => {
  axios
    .get("https://api-cn.cngrupo.com.ar/api/getDirentAgro", {
      timeout: 5000, // Establece un tiempo de espera de 5 segundos (5000 ms)
    })
    .then(async (response) => {
      const data = response.data;

      await db.direccionClientes.clear();
      await db.direccionClientes.bulkAdd(data);
    })
    .catch(function (error) {
      // Manejar el error, incluido el error de tiempo de espera
      if (error.code === "ECONNABORTED") {
        alert("La petición ha excedido el tiempo de espera.");
      } else {
        alert("Error:", error.message);
      }
    });
};

export const updateDataFetching = (tableName) => {
  db.dataFetching.get({ table: tableName }).then(async (data) => {
    if (data == undefined) {
      await setFirstData(tableName);
    }
  });
};

const setFirstData = async (tableName) => {
  console.log(tableName);
  switch (tableName) {
    case "supervisors":
      await db.supervisors.clear();
      await db.supervisors.bulkAdd(supervisors);
      await db.dataFetching.add({ table: "supervisors", date: new Date() });
      break;
    case "blocks":
      await db.blocks.clear();
      await db.blocks.bulkAdd(blocks);
      await db.dataFetching.add({ table: "blocks", date: new Date() });
      break;
    case "machines":
      await db.machine.clear();
      await db.machine.bulkAdd(machines);
      await db.dataFetching.add({ table: "machines", date: new Date() });
      break;
    case "drivers":
      await db.drivers.clear();
      await db.drivers.bulkAdd(drivers);
      await db.dataFetching.add({ table: "drivers", date: new Date() });
      break;
    case "trucks":
      await db.trucks.clear();
      await db.trucks.bulkAdd(trucks);
      await db.dataFetching.add({ table: "trucks", date: new Date() });
      break;
    default:
      break;
  }
};
