import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import RequireAuth from './components/RequireAuth';

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
