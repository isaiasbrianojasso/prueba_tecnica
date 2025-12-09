import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventRes = await api.get(`/events/${id}`);
                setEvent(eventRes.data);

                // Check if user is registered
                try {
                    await api.get(`/events/${id}/my-registration`);
                    setIsRegistered(true);
                } catch (err) {
                    setIsRegistered(false);
                }

                // Fetch attendees if admin or allowed
                if (user.role === 'ADMIN') {
                    const attendeesRes = await api.get(`/events/${id}/attendees`);
                    setAttendees(attendeesRes.data.attendees);
                }
            } catch (err) {
                setError('Error al cargar detalles del evento');
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, user.role]);

    const handleRegister = async () => {
        try {
            await api.post(`/events/${id}/register`);
            setIsRegistered(true);
            setMessage('Te has registrado exitosamente');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error al registrarse');
        }
    };

    const handleCancel = async () => {
        // Need registration ID to cancel, which we might need to fetch or store
        // For simplicity, assuming we can just toggle for now or need to implement cancel endpoint better
        setMessage('Cancelación no implementada en frontend por simplicidad');
    }

    if (loading) return <div>Cargando...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!event) return <div>Evento no encontrado</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2>{event.title}</h2>
            <p style={{ color: '#666' }}>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.description}</p>
            <p><strong>Organizado por:</strong> {event.company?.name}</p>

            {message && <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '1rem' }}>{message}</div>}

            <div style={{ marginTop: '2rem' }}>
                {isRegistered ? (
                    <button disabled style={{ padding: '0.75rem', backgroundColor: '#ccc', border: 'none', borderRadius: '4px' }}>
                        Ya estás registrado
                    </button>
                ) : (
                    <button onClick={handleRegister} style={{ padding: '0.75rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Registrarse al Evento
                    </button>
                )}
            </div>

            {user.role === 'ADMIN' && (
                <div style={{ marginTop: '3rem' }}>
                    <h3>Asistentes ({attendees.length})</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {attendees.map((att) => (
                            <li key={att.id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>
                                {att.employee?.name} ({att.employee?.email}) - {att.checkedIn ? 'Checked In' : 'Pendiente'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EventDetails;
