import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('list');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: ''
    });
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            setEvents(response.data.events || []);
        } catch (err) {
            setError('Error al cargar eventos');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');

        try {
            await api.post('/events', {
                ...newEvent,
                capacity: parseInt(newEvent.capacity) || 0,
                companyId: user?.companyId
            });
            setCreateSuccess('¡Evento creado exitosamente!');
            setNewEvent({ title: '', description: '', date: '', location: '', capacity: '' });
            fetchEvents();
            setTimeout(() => setActiveTab('list'), 1500);
        } catch (err) {
            setCreateError(err.response?.data?.message || 'Error al crear evento');
        }
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerInfo}>
                    <h1>{user?.companyName || 'Dashboard'}</h1>
                    {user && <span>Bienvenido, {user.name} [{user.role}]</span>}
                </div>
                <nav className={styles.nav}>
                    <button
                        className={activeTab === 'list' ? styles.navButtonActive : styles.navButton}
                        onClick={() => setActiveTab('list')}
                    >
                        Ver Eventos
                    </button>
                    {user?.role === 'ADMIN' && (
                        <button
                            className={activeTab === 'create' ? styles.navButtonActive : styles.navButton}
                            onClick={() => setActiveTab('create')}
                        >
                            Agregar Evento
                        </button>
                    )}
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {activeTab === 'list' && (
                    <>
                        <h2 className={styles.sectionTitle}>Próximos Eventos</h2>

                        {loading && <div className={styles.loading}>Cargando...</div>}
                        {error && <div className={styles.error}>{error}</div>}

                        {!loading && !error && events.length === 0 && (
                            <div className={styles.emptyState}>
                                <p>No hay eventos disponibles</p>
                                {user?.role === 'ADMIN' && (
                                    <button
                                        className={styles.createFirstButton}
                                        onClick={() => setActiveTab('create')}
                                    >
                                        Crear tu primer evento
                                    </button>
                                )}
                            </div>
                        )}

                        <div className={styles.eventsGrid}>
                            {events.map((event) => (
                                <div key={event.id} className={styles.eventCard}>
                                    <h3>{event.title}</h3>
                                    <p className={styles.eventDate}>
                                        {new Date(event.date).toLocaleDateString('es-MX', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    {event.location && (
                                        <p className={styles.eventLocation}>{event.location}</p>
                                    )}
                                    <p className={styles.eventDescription}>{event.description}</p>
                                    <Link to={`/events/${event.id}`} className={styles.viewDetailsLink}>
                                        Ver Detalles
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'create' && (
                    <div className={styles.createFormContainer}>
                        <h2 className={styles.sectionTitle}>Crear Nuevo Evento</h2>

                        {createError && <div className={styles.errorAlert}>{createError}</div>}
                        {createSuccess && <div className={styles.successAlert}>{createSuccess}</div>}

                        <form onSubmit={handleCreateEvent} className={styles.form}>
                            <div className={styles.companyInfo}>
                                <span>Empresa: </span>
                                <span>{user?.companyName || `ID: ${user?.companyId}`}</span>
                                <p>El evento se creará para esta empresa</p>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Título del Evento *</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    className={styles.formInput}
                                    required
                                    placeholder="Nombre del evento"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Descripción *</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    className={styles.formTextarea}
                                    required
                                    placeholder="Describe el evento..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Fecha y Hora *</label>
                                <input
                                    type="datetime-local"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    className={styles.formInput}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Ubicación</label>
                                <input
                                    type="text"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                    className={styles.formInput}
                                    placeholder="Dirección o lugar del evento"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Capacidad</label>
                                <input
                                    type="number"
                                    value={newEvent.capacity}
                                    onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                                    className={styles.formInput}
                                    placeholder="Número máximo de asistentes"
                                    min="1"
                                />
                            </div>

                            <button type="submit" className={styles.submitButton}>
                                Crear Evento
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
