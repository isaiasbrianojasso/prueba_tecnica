import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data.events);
            } catch (err) {
                setError('Error al cargar eventos');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Próximos Eventos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {events.map((event) => (
                    <div key={event.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
                        <h3>{event.title}</h3>
                        <p>{new Date(event.date).toLocaleDateString()}</p>
                        <p>{event.description}</p>
                        <Link to={`/events/${event.id}`} style={{ display: 'inline-block', marginTop: '0.5rem', color: '#007bff', textDecoration: 'none' }}>
                            Ver Detalles
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
