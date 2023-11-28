import TicketList from "../components/TicketList";
import HomeButtons from "../components/HomeButtons";
import { CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import db from "../utils/db";
import { saveTicket, saveMetricas } from "../API/aonikenData";
import EnviarTicketsModal from "../components/EnviarTicketsModal";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [loadingModal, setLoadingModal] = useState(false);
  useEffect(() => {
    db.tickets.toArray().then((tickets) => {
      tickets.sort((a, b) => b.created - a.created);

      setTickets(tickets);
    });
  }, [onLoad]);

  const onLoad = (val) => {
    setLoadingModal(val);
  };
  const startSendingProcess = () => {
    setLoadingModal(true);
    onSend();
  };

  const handleDeleteTickets = async () => {
    const tickets = await db.tickets.toArray();
    const deletePromises = tickets
      .filter((ticket) => ticket.sent)
      .map((ticket) => db.tickets.delete(ticket.id));
    await Promise.all(deletePromises);
    db.tickets.toArray().then((tickets) => {
      setTickets(tickets.sort((a, b) => b.created - a.created));
    });
  };

  const onSend = async () => {
    if (tickets.length > 0) {
        try {
            const timeout = new Promise((_, reject) => setTimeout(() => reject('No se pudieron guardar todos los tickets. Intente enviar nuevamente los tickets faltantes'), 10000));
            const updatedTickets = await Promise.race([
                Promise.all(
                    tickets.map(async (ticket) => {
                        if (!ticket.sent) {
                            await saveTicket(ticket);
                        }
                        return ticket;
                    })
                ),
                timeout
            ]);
            let maxNumeroVentaInt = tickets.reduce((max, item) => item.numeroVentaInt > max ? item.numeroVentaInt : max, tickets[0].numeroVentaInt);

            await saveMetricas({cantidadTickets: tickets.length, ultimoTicket: maxNumeroVentaInt})
            db.tickets.toArray().then((tickets) => {
                setTickets(tickets.sort((a, b) => b.created - a.created));
                setLoadingModal(false);
            });
            if(tickets.length > 20) {
              alert("Recuerda borrar los tickets enviados cuando ya no los necesitas")
            }
        } catch (error) {
            alert(error); // Mostrar el mensaje de error en un alert
            setLoadingModal(false);
        }
    } else {
        setLoadingModal(false);
    }
};


  return (
    <>
      {loading && <CircularProgress />}
      <EnviarTicketsModal isOpen={loadingModal} />
      <TicketList tickets={tickets} />
      <HomeButtons
        deleteTickets={handleDeleteTickets}
        updateTickets={startSendingProcess}
      />
    </>
  );
}
