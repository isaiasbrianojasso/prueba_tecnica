import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <Link to="/" style={{ marginRight: '1rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>Event Manager</Link>
            </div>
            <div>
                {user ? (
                    <>
                        <span style={{ marginRight: '1rem' }}>Hola, {user.name}</span>
                        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ marginRight: '1rem' }}>Iniciar Sesión</Link>
                        <Link to="/register">Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
