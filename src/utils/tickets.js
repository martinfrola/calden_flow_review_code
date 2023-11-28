import { v4 as uuidv4 } from "uuid";
import db from "./db";

export const saveDispatch = (dispatch, inicio, fin, estadoInicial, aclaracion) => {
  const numeroVenta = localStorage.getItem("Número de venta");
  const maquina = localStorage.getItem("machine");
  const horometro = localStorage.getItem("odometer");
  const operacionTipo = localStorage.getItem("tabacalOperation");
  const bloqueID = localStorage.getItem("bloqueID");
  const bloqueDescripcion = localStorage.getItem("bloqueDescripcion");
  const supervisorLegajo = localStorage.getItem("supervisorLegajo");
  const supervisorNombre = localStorage.getItem("supervisorNombre");
  const cuarteo = localStorage.getItem("cuarteo");
  const emiteTicket = localStorage.getItem("emiteTicket")
  const firma = localStorage.getItem("firma");
  const driverString = localStorage.getItem("driver");
  const driverObject = JSON.parse(driverString);

  const productoString = localStorage.getItem("producto")
  const productoObject = JSON.parse(productoString)

  const truckString = localStorage.getItem("truck");
  const truckObject = JSON.parse(truckString);

  let truckBackupObject = null;

  if (localStorage.getItem("backupEnabled") === "true") {
    const truckBackupString = localStorage.getItem("backup");
    truckBackupObject = JSON.parse(truckBackupString);
  }

  const operationString = localStorage.getItem("operation");
  const operationObject = JSON.parse(operationString);
  const operationMode = operationObject.title
  const cliente = operationObject.title.split(" ").shift()

  const proximoRemito = localStorage.getItem("proximoRemito");
  let proximoRemitoObject;
  if (proximoRemito != null) {
    proximoRemitoObject = JSON.parse(proximoRemito);
  } else {
    proximoRemitoObject = { remito: 0 };
  }

  const notaVenta = localStorage.getItem("notaVenta");
  const notaVentaObject = JSON.parse(notaVenta);

  const location = window.MyInterface.getDeviceLocation();
  const [lat, lng] = location.split(",").map(parseFloat);

  const newTicket = {
    id: uuidv4(),
    text: `Ticket ${numeroVenta}`,
    sent: false,
    created: Date.now(),
    lat: lat,
    lng: lng ? lng : null,
    inicio: inicio,
    fin: fin,
    estadoInicial: estadoInicial,
    entregaBruta: dispatch + " litros",
    estadoFinal: parseFloat(estadoInicial) + parseFloat(dispatch) + " litros",
    numeroVenta: numeroVenta,
    numeroVentaInt: parseInt(numeroVenta),
    cliente:
      cliente == "Agro"
        ? notaVentaObject.RazonSocialCliente
        : cliente,
    producto: operationObject.title == "Agro" ? notaVentaObject.CodigoProducto : productoObject.CodigoProducto,
    patente: truckObject.Patente,
    patenteAuxilio: truckBackupObject ? truckBackupObject.Patente : "",
    choferLegajo: driverObject.Legajo,
    choferNombre: driverObject.Nombre,
    maquina: maquina,
    horometro: horometro,
    operacion: operacionTipo,
    bloqueID: bloqueID,
    bloqueDescripcion: bloqueDescripcion,
    supervisorLegajo: supervisorLegajo,
    supervisorNombre: supervisorNombre,
    cuarteo: cuarteo,
    firma: firma,
    aclaracion: aclaracion,
    modo: "QR",
    operacionVenta: operationMode,
    remito: operationObject.title == "Agro" ? `${truckObject.PuntoVenta}-${proximoRemitoObject.remito.toString().padStart(8, "0")}` : null,
    notaVenta:  notaVenta,
    numeroCuenta: operationObject.title == "Agro" ? notaVentaObject.NumeroCuenta : null,
    numeroSubcuenta: operationObject.title == "Agro" ? notaVentaObject.NumeroSubCuenta : null,
    codigoEntrega: operationObject.title == "Agro" ? notaVentaObject.CodigoDireccionEntrega : null,
    codigoPostal: operationObject.title == "Agro" ? notaVentaObject.CodigoPostal : null,
    codigoProvincia: operationObject.title == "Agro" ? notaVentaObject.CodigoProvincia : null,
    cuit: operationObject.title == "Agro" ? notaVentaObject.CUITCliente : null,
    codigoNotaVenta:operationObject.title == "Agro" ? notaVentaObject.CodigoNotaVenta : null,
    numeroNotaVenta: operationObject.title == "Agro" ? notaVentaObject.NumeroNotaVenta : null,
    emiteTicket: emiteTicket ? emiteTicket : ""
  };

  localStorage.setItem(
    "proximoRemito",
    JSON.stringify({
      patente: truckObject.Patente,
      remito: parseInt(proximoRemitoObject.remito) + 1,
    })
  );

  db.tickets.put(newTicket).then((id) => {
    localStorage.setItem("idTicket", id);
  });
};

export const saveDispatchBluetooth = (
  entregaBruta,
  numeroVenta,
  inicio,
  fin,
  totalizadorFinal,
  notaVenta
) => {
  const maquina = localStorage.getItem("machine");
  const horometro = localStorage.getItem("odometer");
  const operacionTipo = localStorage.getItem("tabacalOperation");
  const bloqueID = localStorage.getItem("bloqueID");
  const bloqueDescripcion = localStorage.getItem("bloqueDescripcion");
  const supervisorLegajo = localStorage.getItem("supervisorLegajo");
  const supervisorNombre = localStorage.getItem("supervisorNombre");
  const cuarteo = localStorage.getItem("cuarteo");
  const emiteTicket = localStorage.getItem("emiteTicket")
  const firma = localStorage.getItem("firma");
  const driverString = localStorage.getItem("driver");
  const driverObject = JSON.parse(driverString);

  const productoString = localStorage.getItem("producto")
  const productoObject = JSON.parse(productoString)

  const truckString = localStorage.getItem("truck");
  const truckObject = JSON.parse(truckString);

  let truckBackupObject = null;

  if (localStorage.getItem("backupEnabled") === "true") {
    const truckBackupString = localStorage.getItem("backup");
    truckBackupObject = JSON.parse(truckBackupString);
  }

  const operationString = localStorage.getItem("operation");
  const operationObject = JSON.parse(operationString);
  const operationMode = operationObject.title
  const cliente = operationObject.title.split(" ").shift()

  const notaVentaObject = JSON.parse(notaVenta);

  const location = window.MyInterface.getDeviceLocation();
  const [lat, lng] = location.split(",").map(parseFloat);
  const totalizadorInicial =
    parseFloat(totalizadorFinal) - parseFloat(entregaBruta);

     const proximoRemito = localStorage.getItem("proximoRemito");
  let proximoRemitoObject;
  if (proximoRemito != null) {
    proximoRemitoObject = JSON.parse(proximoRemito);
  } else {
    proximoRemitoObject = { remito: 0 };
  }

  const newTicket = {
    id: uuidv4(),
    text: `Ticket ${numeroVenta}`,
    sent: false,
    created: Date.now(),
    lat: lat,
    lng: lng ? lng : null,
    inicio: inicio,
    fin: fin,
    estadoInicial: redondear(totalizadorInicial, 1) + " litros",
    entregaBruta: entregaBruta + " litros",
    estadoFinal: redondear(totalizadorFinal, 1) + " litros",
    numeroVenta: `${numeroVenta}`,
    numeroVentaInt: numeroVenta,
    cliente:
      cliente == "Agro"
        ? notaVentaObject.RazonSocialCliente
        : cliente,
    producto: operationObject.title == "Agro" ? notaVentaObject.CodigoProducto : productoObject.CodigoProducto,
    patente: truckObject.Patente,
    patenteAuxilio: truckBackupObject ? truckBackupObject.Patente : "",
    choferLegajo: driverObject.Legajo,
    choferNombre: driverObject.Nombre,
    maquina: maquina,
    horometro: horometro,
    operacion: operacionTipo,
    bloqueID: bloqueID,
    bloqueDescripcion: bloqueDescripcion,
    supervisorLegajo: supervisorLegajo,
    supervisorNombre: supervisorNombre,
    cuarteo: cuarteo,
    firma: firma,
    notaVenta: notaVenta,
    modo: "Bluetooth",
    operacionVenta: operationMode,
    remito: operationObject.title == "Agro" ? `${truckObject.PuntoVenta}-${proximoRemitoObject.remito.toString().padStart(8, "0")}` : null,
    numeroCuenta: operationObject.title == "Agro" ? notaVentaObject.NumeroCuenta : null,
    numeroSubcuenta: operationObject.title == "Agro" ? notaVentaObject.NumeroSubCuenta : null,
    codigoEntrega: operationObject.title == "Agro" ? notaVentaObject.CodigoDireccionEntrega : null,
    codigoPostal: operationObject.title == "Agro" ? notaVentaObject.CodigoPostal : null,
    codigoProvincia: operationObject.title == "Agro" ? notaVentaObject.CodigoProvincia : null,
    cuit: operationObject.title == "Agro" ? notaVentaObject.CUITCliente : null,
    codigoNotaVenta:operationObject.title == "Agro" ? notaVentaObject.CodigoNotaVenta : null,
    numeroNotaVenta: operationObject.title == "Agro" ? notaVentaObject.NumeroNotaVenta : null,
    emiteTicket: emiteTicket
  };
  localStorage.setItem(
    "proximoRemito",
    JSON.stringify({
      patente: truckObject.Patente,
      remito: parseInt(proximoRemitoObject.remito) + 1,
    })
  );
  localStorage.setItem("idTicket", newTicket.id);
  db.tickets.put(newTicket).then((id) => {
    localStorage.setItem("idTicket", id);
  });
};

export const searchForTotalizer = async (numeroVenta) => {
  const tickets = await db.tickets.toArray();
  const ultimoTicket = tickets.filter((ticket) => {
    return ticket.numeroVenta === parseInt(numeroVenta) - 1;
  });
  if (ultimoTicket[0] != undefined) {
    return parseFloat(ultimoTicket[0].estadoFinal);
  } else {
    return 0;
  }
};

export const getDate = () => {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");
  const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};

function redondear(num, decimales) {
  let factor = Math.pow(10, decimales);
  return Math.round(num * factor) / factor;
}
