import { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'viewer' 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(formData);
            alert("Signup successful! You can now login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.msg || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { 
        width: '100%', 
        padding: '12px', 
        marginBottom: '1.2rem', 
        borderRadius: '8px', 
        border: '1px solid #e2e8f0', 
        boxSizing: 'border-box',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s'
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            backgroundColor: '#f1f5f9',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <form onSubmit={handleSubmit} style={{ 
                background: 'white', 
                padding: '2.5rem', 
                borderRadius: '16px', 
                width: '100%',
                maxWidth: '400px', 
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' 
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ 
                        backgroundColor: '#eff6ff', 
                        width: '50px', 
                        height: '50px', 
                        borderRadius: '12px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        margin: '0 auto 1rem' 
                    }}>
                        <UserPlus color="#2563eb" size={28} />
                    </div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>Create Account</h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '5px' }}>Join the Pulse Video platform</p>
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    <label style={labelStyle}>Full Name</label>
                    <input 
                        type="text" 
                        placeholder="John Doe" 
                        required 
                        style={inputStyle} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                    />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    <label style={labelStyle}>Email Address</label>
                    <input 
                        type="email" 
                        placeholder="name@company.com" 
                        required 
                        style={inputStyle} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                    />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    <label style={labelStyle}>Password</label>
                    <input 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        style={inputStyle} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                    />
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={labelStyle}>Assign Role</label>
                    <select 
                        style={inputStyle} 
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="viewer">Viewer (Read Library Only)</option>
                        <option value="editor">Editor (Upload & Manage)</option>
                        <option value="admin">Admin (Full System Access)</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: loading ? '#94a3b8' : '#2563eb', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: loading ? 'not-allowed' : 'pointer', 
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'background-color 0.2s'
                    }}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Already have an account? </span>
                    <span 
                        onClick={() => navigate('/login')} 
                        style={{ 
                            color: '#2563eb', 
                            cursor: 'pointer', 
                            fontWeight: '600', 
                            fontSize: '0.9rem' 
                        }}
                    >
                        Login
                    </span>
                </div>
            </form>
        </div>
    );
};

const labelStyle = { 
    display: 'block', 
    marginBottom: '8px', 
    fontSize: '0.85rem', 
    fontWeight: '600', 
    color: '#475569' 
};

export default Signup;