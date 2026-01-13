import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupportAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await axios.get('/api/support');
    setTickets(res.data.tickets);
  };

  const createTicket = async () => {
    await axios.post('/api/support', { subject, message });
    setSubject(''); setMessage('');
    fetchTickets();
  };

  const sendReply = async (id) => {
    await axios.post(`/api/support/${id}/message`, { content: reply });
    setReply('');
    fetchTickets();
  };

  const closeTicket = async (id) => {
    await axios.post(`/api/support/${id}/close`);
    fetchTickets();
  };

  return (
    <div>
      <h2>Support Admin (Tickets)</h2>
      <div>
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Sujet" />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" />
        <button onClick={createTicket}>Créer un ticket</button>
      </div>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id}>
            <b>{ticket.subject}</b> - {ticket.status}
            <button onClick={() => setSelectedTicket(ticket)}>Voir</button>
            <button onClick={() => closeTicket(ticket._id)}>Fermer</button>
          </li>
        ))}
      </ul>
      {selectedTicket && (
        <div>
          <h3>{selectedTicket.subject}</h3>
          <ul>
            {selectedTicket.messages.map((msg, i) => (
              <li key={i}><b>{msg.sender}:</b> {msg.content}</li>
            ))}
          </ul>
          <input value={reply} onChange={e => setReply(e.target.value)} placeholder="Réponse" />
          <button onClick={() => sendReply(selectedTicket._id)}>Envoyer</button>
        </div>
      )}
    </div>
  );
};

export default SupportAdmin;
