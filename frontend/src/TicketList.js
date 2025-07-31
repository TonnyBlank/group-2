import React, { useEffect, useState } from 'react';
import api from './api';

function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    api.get('api/tickets/')
      .then(response => {
        setTickets(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (ticketId, newStatus) => {
    api.patch(`api/tickets/${ticketId}/`, { status: newStatus })
      .then(response => {
        setTickets(tickets => tickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        ));
      })
      .catch(error => {
        console.error('Error updating ticket status:', error);
      });
  };

  const handleCommentChange = (ticketId, value) => {
    setCommentInputs(inputs => ({ ...inputs, [ticketId]: value }));
  };

  const handleCommentSubmit = (ticketId) => {
    const commentText = commentInputs[ticketId];
    if (!commentText) return;
    api.post('api/comments/', { ticket: ticketId, text: commentText })
      .then(response => {
        setTickets(tickets => tickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, comments: [...(ticket.comments || []), response.data] }
            : ticket
        ));
        setCommentInputs(inputs => ({ ...inputs, [ticketId]: '' }));
      })
      .catch(error => {
        console.error('Error adding comment:', error);
      });
  };

  if (loading) return <div>Loading tickets...</div>;

  return (
    <div className="card p-4 my-4">
      <h2 className="mb-3">Ticket List</h2>
      <ul className="list-group">
        {tickets.map(ticket => (
          <li key={ticket.id} className="list-group-item mb-3">
            <strong>{ticket.issue_category}</strong> - {ticket.description} <br />
            Status: {userRole === 'technician' ? (
              <select
                className="form-select d-inline w-auto ms-2"
                value={ticket.status}
                onChange={e => handleStatusChange(ticket.id, e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            ) : (
              <span className="badge bg-secondary ms-2">{ticket.status}</span>
            )}
            <br />
            <strong>Comments:</strong>
            <ul className="list-group list-group-flush">
              {(ticket.comments || []).map((comment, idx) => (
                <li key={idx} className="list-group-item ps-4">
                  <strong>{comment.user}:</strong> {comment.text}
                  <br />
                  <small className="text-muted">{new Date(comment.timestamp).toLocaleString()}</small>
                </li>
              ))}
            </ul>
              <div className="mt-2">
                <input
                  type="text"
                  className="form-control d-inline w-75 me-2"
                  placeholder="Add a comment"
                  value={commentInputs[ticket.id] || ''}
                  onChange={e => handleCommentChange(ticket.id, e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => handleCommentSubmit(ticket.id)}>Submit</button>
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TicketList;
