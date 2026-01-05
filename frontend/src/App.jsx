import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    // If user is already logged in, send them to dashboard
    return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
                    <Routes>
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
                        
                        <Route 
                            path="/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } 
                        />

                        <Route path="*" element={<Navigate to="/signup" />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;