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

    // Estado para crear evento
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: ''
    });
    const [createError, setCreateError] = useState('');
    const [createSuccess, setCreateSuccess] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);

    // Estado de usuarios
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState('');
    const [userMessage, setUserMessage] = useState({ text: '', type: '' });
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({
        name: '',
        email: '',
        password: '',
        role: 'EMPLOYEE'
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (activeTab === 'users' && user?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [activeTab, user?.role]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/events');
            setEvents(response.data.events || []);
            // console.log('eventos cargados:', response.data.events);
        } catch (err) {
            setError('Error al cargar eventos');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setUsersLoading(true);
            setUsersError('');
            const response = await api.get('/employees');
            setUsers(response.data.employees || []);
        } catch (err) {
            setUsersError('Error al cargar usuarios');
        } finally {
            setUsersLoading(false);
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
            setCreateSuccess('Evento creado');
            setNewEvent({ title: '', description: '', date: '', location: '', capacity: '' });
            fetchEvents();
            setTimeout(() => setActiveTab('list'), 1500);
        } catch (err) {
            setCreateError(err.response?.data?.message || 'Error al crear evento');
        }
    };

    // Funciones para CRUD de eventos
    const resetEventForm = () => {
        setNewEvent({ title: '', description: '', date: '', location: '', capacity: '' });
        setEditingEvent(null);
        setCreateError('');
        setCreateSuccess('');
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        setCreateError('');
        setCreateSuccess('');

        try {
            await api.put(`/events/${editingEvent.id}`, {
                ...newEvent,
                capacity: parseInt(newEvent.capacity) || 0
            });
            setCreateSuccess('Evento actualizado');
            resetEventForm();
            fetchEvents();
            setTimeout(() => setActiveTab('list'), 1500);
        } catch (err) {
            setCreateError(err.response?.data?.message || 'Error al actualizar evento');
        }
    };

    const handleDeleteEvent = async (eventId, eventTitle) => {
        if (!window.confirm(`¿Eliminar evento "${eventTitle}"?`)) return;

        try {
            await api.delete(`/events/${eventId}`);
            setCreateSuccess('Evento eliminado');
            fetchEvents();
        } catch (err) {
            setCreateError(err.response?.data?.message || 'Error al eliminar evento');
        }
    };

    const startEditEvent = (eventToEdit) => {
        setEditingEvent(eventToEdit);
        setNewEvent({
            title: eventToEdit.title,
            description: eventToEdit.description || '',
            date: eventToEdit.date ? new Date(eventToEdit.date).toISOString().slice(0, 16) : '',
            location: eventToEdit.location || '',
            capacity: eventToEdit.capacity?.toString() || ''
        });
        setActiveTab('create');
    };

    const resetUserForm = () => {
        setUserForm({ name: '', email: '', password: '', role: 'EMPLOYEE' });
        setEditingUser(null);
        setShowUserForm(false);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setUserMessage({ text: '', type: '' });

        try {
            await api.post('/employees', {
                ...userForm,
                companyId: user?.companyId
            });
            setUserMessage({ text: 'Usuario creado', type: 'success' });
            resetUserForm();
            fetchUsers();
        } catch (err) {
            setUserMessage({
                text: err.response?.data?.message || 'Error al crear usuario',
                type: 'error'
            });
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setUserMessage({ text: '', type: '' });

        try {
            const updateData = { ...userForm };
            if (!updateData.password) delete updateData.password;

            await api.put(`/employees/${editingUser.id}`, updateData);
            setUserMessage({ text: 'Cambios guardados', type: 'success' });
            resetUserForm();
            fetchUsers();
        } catch (err) {
            setUserMessage({
                text: err.response?.data?.message || 'Error al actualizar usuario',
                type: 'error'
            });
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!window.confirm(`¿Estás seguro de eliminar a ${userName}?`)) return;

        try {
            await api.delete(`/employees/${userId}`);
            setUserMessage({ text: 'Usuario eliminado correctamente', type: 'success' });
            fetchUsers();
        } catch (err) {
            setUserMessage({
                text: err.response?.data?.message || 'Error al eliminar usuario',
                type: 'error'
            });
        }
    };

    const startEditUser = (userToEdit) => {
        setEditingUser(userToEdit);
        setUserForm({
            name: userToEdit.name,
            email: userToEdit.email,
            password: '',
            role: userToEdit.role
        });
        setShowUserForm(true);
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
                    {user?.role === 'ADMIN' && (
                        <button
                            className={activeTab === 'users' ? styles.navButtonActive : styles.navButton}
                            onClick={() => setActiveTab('users')}
                        >
                            Gestionar Usuarios
                        </button>
                    )}
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Lista de Eventos */}
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
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                        <Link to={`/events/${event.id}`} className={styles.viewDetailsLink}>
                                            Ver Detalles
                                        </Link>
                                        {user?.role === 'ADMIN' && (
                                            <>
                                                <button
                                                    onClick={() => startEditEvent(event)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'transparent',
                                                        border: '1px solid #667eea',
                                                        color: '#667eea',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id, event.title)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'transparent',
                                                        border: '1px solid #fc8181',
                                                        color: '#fc8181',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Crear/Editar Evento */}
                {activeTab === 'create' && (
                    <div className={styles.createFormContainer}>
                        <h2 className={styles.sectionTitle}>
                            {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
                        </h2>

                        {createError && <div className={styles.errorAlert}>{createError}</div>}
                        {createSuccess && <div className={styles.successAlert}>{createSuccess}</div>}

                        <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent} className={styles.form}>
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

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="submit" className={styles.submitButton}>
                                    {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
                                </button>
                                {editingEvent && (
                                    <button
                                        type="button"
                                        className={styles.navButton}
                                        onClick={resetEventForm}
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/* Gestión de Usuarios */}
                {activeTab === 'users' && user?.role === 'ADMIN' && (
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Gestión de Usuarios</h2>
                            <button
                                className={styles.submitButton}
                                style={{ padding: '0.75rem 1.5rem' }}
                                onClick={() => { resetUserForm(); setShowUserForm(true); }}
                            >
                                + Nuevo Usuario
                            </button>
                        </div>

                        {/* Mensajes */}
                        {userMessage.text && (
                            <div className={userMessage.type === 'success' ? styles.successAlert : styles.errorAlert}>
                                {userMessage.text}
                            </div>
                        )}

                        {/* Formulario de Usuario */}
                        {showUserForm && (
                            <div className={styles.form} style={{ marginBottom: '2rem' }}>
                                <h3 style={{ color: '#f7fafc', marginBottom: '1rem' }}>
                                    {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                                </h3>
                                <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                                    <div className={styles.formGroup}>
                                        <label>Nombre *</label>
                                        <input
                                            type="text"
                                            value={userForm.name}
                                            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                                            className={styles.formInput}
                                            required
                                            placeholder="Nombre completo"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            value={userForm.email}
                                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                            className={styles.formInput}
                                            required
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>{editingUser ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña *'}</label>
                                        <input
                                            type="password"
                                            value={userForm.password}
                                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                                            className={styles.formInput}
                                            required={!editingUser}
                                            placeholder="Mínimo 6 caracteres"
                                            minLength={6}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Rol *</label>
                                        <select
                                            value={userForm.role}
                                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                            className={styles.formInput}
                                            required
                                        >
                                            <option value="EMPLOYEE">Empleado</option>
                                            <option value="ADMIN">Administrador</option>
                                        </select>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button type="submit" className={styles.submitButton}>
                                            {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.navButton}
                                            onClick={resetUserForm}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Lista de Usuarios */}
                        {usersLoading && <div className={styles.loading}>Cargando usuarios...</div>}
                        {usersError && <div className={styles.error}>{usersError}</div>}

                        {!usersLoading && !usersError && (
                            <div className={styles.form}>
                                {users.length === 0 ? (
                                    <p style={{ color: '#a0aec0', textAlign: 'center', padding: '2rem' }}>
                                        No hay usuarios registrados
                                    </p>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                                <th style={{ padding: '1rem', textAlign: 'left', color: '#a0aec0', fontSize: '0.85rem', textTransform: 'uppercase' }}>Nombre</th>
                                                <th style={{ padding: '1rem', textAlign: 'left', color: '#a0aec0', fontSize: '0.85rem', textTransform: 'uppercase' }}>Email</th>
                                                <th style={{ padding: '1rem', textAlign: 'left', color: '#a0aec0', fontSize: '0.85rem', textTransform: 'uppercase' }}>Rol</th>
                                                <th style={{ padding: '1rem', textAlign: 'right', color: '#a0aec0', fontSize: '0.85rem', textTransform: 'uppercase' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <td style={{ padding: '1rem', color: '#f7fafc' }}>{u.name}</td>
                                                    <td style={{ padding: '1rem', color: '#a0aec0' }}>{u.email}</td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '50px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            backgroundColor: u.role === 'ADMIN' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(72, 187, 120, 0.2)',
                                                            color: u.role === 'ADMIN' ? '#667eea' : '#68d391'
                                                        }}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                        <button
                                                            onClick={() => startEditUser(u)}
                                                            style={{
                                                                padding: '0.5rem 1rem',
                                                                marginRight: '0.5rem',
                                                                background: 'transparent',
                                                                border: '1px solid #667eea',
                                                                color: '#667eea',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Editar
                                                        </button>
                                                        {u.id !== user?.id && (
                                                            <button
                                                                onClick={() => handleDeleteUser(u.id, u.name)}
                                                                style={{
                                                                    padding: '0.5rem 1rem',
                                                                    background: 'transparent',
                                                                    border: '1px solid #fc8181',
                                                                    color: '#fc8181',
                                                                    borderRadius: '6px',
                                                                    cursor: 'pointer'
                                                                }}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
