import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import styles from './EventDetails.module.css';

const EventDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const eventRes = await api.get(`/events/${id}`);
                setEvent(eventRes.data);

                try {
                    await api.get(`/events/${id}/my-registration`);
                    setIsRegistered(true);
                } catch (err) {
                    setIsRegistered(false);
                }

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
            setMessage('¡Te has registrado exitosamente!');
            setMessageType('success');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error al registrarse');
            setMessageType('error');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('es-MX', { month: 'short' }).toUpperCase(),
            year: date.getFullYear(),
            time: date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <span className={styles.errorIcon}>😕</span>
                <h2 className={styles.errorTitle}>Oops!</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/')} className={styles.backButton}>
                    ← Volver al inicio
                </button>
            </div>
        );
    }

    if (!event) {
        return (
            <div className={styles.errorContainer}>
                <span className={styles.errorIcon}>🔍</span>
                <h2 className={styles.errorTitle}>Evento no encontrado</h2>
                <button onClick={() => navigate('/')} className={styles.backButton}>
                    ← Volver al inicio
                </button>
            </div>
        );
    }

    const dateInfo = formatDate(event.date);

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <button onClick={() => navigate('/')} className={styles.backButton}>
                    ← Volver
                </button>

                <div className={styles.card}>
                    {/* Header con gradiente */}
                    <div className={styles.header}>
                        <div className={styles.headerOverlay}></div>

                        <div className={styles.dateBox}>
                            <span className={styles.dateDay}>{dateInfo.day}</span>
                            <span className={styles.dateMonth}>{dateInfo.month}</span>
                        </div>

                        <h1 className={styles.title}>{event.title}</h1>

                        {event.company?.name && (
                            <span className={styles.company}>
                                {event.company.name}
                            </span>
                        )}
                    </div>

                    {/* Contenido */}
                    <div className={styles.content}>
                        {/* Info Cards Grid */}
                        <div className={styles.infoGrid}>
                            <div className={styles.infoCard}>
                                <div className={styles.infoLabel}>Fecha</div>
                                <div className={styles.infoValue}>{dateInfo.full}</div>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoLabel}>Hora</div>
                                <div className={styles.infoValue}>{dateInfo.time}</div>
                            </div>
                            {event.location && (
                                <div className={styles.infoCard}>
                                    <div className={styles.infoLabel}>Ubicación</div>
                                    <div className={styles.infoValue}>{event.location}</div>
                                </div>
                            )}
                            {event.capacity && (
                                <div className={styles.infoCard}>
                                    <div className={styles.infoLabel}>Capacidad</div>
                                    <div className={styles.infoValue}>{event.capacity} personas</div>
                                </div>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Acerca de este evento</h3>
                            <p className={styles.description}>{event.description}</p>
                        </div>

                        {/* Mensaje de feedback */}
                        {message && (
                            <div className={messageType === 'success' ? styles.messageSuccess : styles.messageError}>
                                <span>{messageType === 'success' ? '✓' : '⚠'}</span>
                                <span>{message}</span>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <div className={styles.buttonContainer}>
                            {isRegistered ? (
                                <div className={styles.registeredButton}>
                                    <span>✓</span>
                                    Ya estás registrado
                                </div>
                            ) : (
                                <button onClick={handleRegister} className={styles.registerButton}>
                                    Registrarse al Evento
                                </button>
                            )}
                        </div>

                        {/* Sección de Asistentes (solo admin) */}
                        {user.role === 'ADMIN' && (
                            <div className={styles.attendeesSection}>
                                <h3 className={styles.attendeesTitle}>
                                    Asistentes
                                    <span className={styles.attendeesBadge}>{attendees.length}</span>
                                </h3>

                                {attendees.length === 0 ? (
                                    <p className={styles.emptyMessage}>
                                        Aún no hay asistentes registrados
                                    </p>
                                ) : (
                                    <ul className={styles.attendeesList}>
                                        {attendees.map((att) => (
                                            <li key={att.id} className={styles.attendeeItem}>
                                                <div className={styles.attendeeInfo}>
                                                    <div className={styles.attendeeAvatar}>
                                                        {att.employee?.name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <div className={styles.attendeeName}>
                                                            {att.employee?.name || 'Sin nombre'}
                                                        </div>
                                                        <div className={styles.attendeeEmail}>
                                                            {att.employee?.email}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={att.checkedIn ? styles.statusCheckedIn : styles.statusPending}>
                                                    {att.checkedIn ? '✓ Checked In' : '⏳ Pendiente'}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
