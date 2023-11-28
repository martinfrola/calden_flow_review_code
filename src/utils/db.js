import Dexie from "dexie";

class TicketDatabase extends Dexie {
  constructor() {
    super("CaldenFlow");
    this.version(1).stores({
      tickets: "++id, sent, numeroVenta, id",
      supervisors: "++id",
      machine: "++id",
      blocks: "++id",
      supervisorsLedesma: "++id",
      machineLedesma: "++id",
      blocksLedesma: "++id",
      drivers: "++id",
      trucks: "++id",
      notasVenta: "++id",
      clientesAgro: "++id",
      direccionClientes: "++id",
      productos: "++id",
      ultimosRemitos: "++id, patente",
      dataFetching: "++id, table",
    });
  }
}

const db = new TicketDatabase();

export default db;
