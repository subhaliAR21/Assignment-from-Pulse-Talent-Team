import { useEffect, useState } from 'react';
import { getVideos, uploadVideo } from '../services/api';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { Play, Upload, ShieldCheck, LogOut, Video, Clock, AlertTriangle } from 'lucide-react';

const socket = io('http://localhost:5000');

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [videos, setVideos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [selectedVideoId, setSelectedVideoId] = useState(null);

    useEffect(() => {
        fetchVideos();
        socket.on('processing_update', (data) => {
            setVideos(prev => prev.map(v => v._id === data.videoId ? { ...v, status: 'processing' } : v));
        });
        socket.on('processing_complete', () => fetchVideos());
        return () => {
            socket.off('processing_update');
            socket.off('processing_complete');
        };
    }, []);

    const fetchVideos = async () => {
        try { const { data } = await getVideos(); setVideos(data); } 
        catch (err) { console.error(err); }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('video', file);
        setUploading(true);
        try {
            await uploadVideo(formData, (p) => setProgress(Math.round((p.loaded * 100) / p.total)));
            fetchVideos();
        } catch (err) { alert("Upload failed"); } 
        finally { setUploading(false); setProgress(0); }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
            {/* Left Sidebar */}
            <nav style={{ width: '260px', backgroundColor: '#1e293b', color: 'white', padding: '2rem 1rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem', padding: '0 10px' }}>
                    <ShieldCheck size={32} color="#38bdf8" />
                    <h2 style={{ margin: 0, fontSize: '1.5rem', letterSpacing: '-1px' }}>PULSE <span style={{fontWeight:300}}>VIDEO</span></h2>
                </div>
                
                <div style={{ flexGrow: 1 }}>
                    <div style={{ padding: '12px', backgroundColor: '#334155', borderRadius: '8px', marginBottom: '20px' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Logged in as</p>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{user.name}</p>
                        <span style={{ fontSize: '0.7rem', backgroundColor: '#0ea5e9', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>{user.role}</span>
                    </div>
                </div>

                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', color: '#f1f5f9', cursor: 'pointer', padding: '10px' }}>
                    <LogOut size={20} /> Logout
                </button>
            </nav>

            {/* Main Content Area */}
            <main style={{ flexGrow: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ margin: 0, color: '#0f172a' }}>Video Management</h1>
                    <p style={{ color: '#64748b' }}>Upload, monitor, and stream your content securely.</p>
                </header>

                {/* Upload Section - Pro Look */}
                {(user.role === 'admin' || user.role === 'editor') && (
                    <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', marginBottom: '2.5rem', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '10px' }}>
                                <Upload color="#2563eb" />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <h4 style={{ margin: 0 }}>Push New Content</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>MP4 files up to 100MB</p>
                            </div>
                            <label style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'inline-block' }}>
                                {uploading ? `Uploading ${progress}%` : 'Select Video'}
                                <input type="file" hidden accept="video/*" onChange={handleUpload} disabled={uploading} />
                            </label>
                        </div>
                        {uploading && (
                            <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '10px', marginTop: '15px', overflow: 'hidden' }}>
                                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#2563eb', transition: 'width 0.3s' }}></div>
                            </div>
                        )}
                    </div>
                )}

                {/* Video Player (Conditional) */}
                {selectedVideoId && (
                    <div style={{ marginBottom: '2.5rem', backgroundColor: '#000', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}>
                        <div style={{ backgroundColor: '#1e293b', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>Streaming: {videos.find(v => v._id === selectedVideoId)?.title}</span>
                            <button onClick={() => setSelectedVideoId(null)} style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}>Close Player ✕</button>
                        </div>
                        <video key={selectedVideoId} controls width="100%" autoPlay style={{ maxHeight: '600px' }}>
                            <source src={`http://localhost:5000/api/videos/stream/${selectedVideoId}?token=${localStorage.getItem('token')}`} type="video/mp4" />
                        </video>
                    </div>
                )}

                {/* Video Grid */}
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Video size={20} /> Your Library
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {videos.map(video => (
                        <div key={video._id} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'transform 0.2s', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                            <div style={{ height: '160px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                                <Video size={48} />
                            </div>
                            <div style={{ padding: '1.2rem' }}>
                                <h4 style={{ margin: '0 0 10px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</h4>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {video.status === 'safe' ? <ShieldCheck size={16} color="#10b981" /> : video.status === 'flagged' ? <AlertTriangle size={16} color="#ef4444" /> : <Clock size={16} color="#f59e0b" />}
                                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: video.status === 'safe' ? '#10b981' : video.status === 'flagged' ? '#ef4444' : '#f59e0b', textTransform: 'uppercase' }}>
                                            {video.status}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{(video.size / (1024*1024)).toFixed(2)} MB</span>
                                </div>

                                {video.status === 'safe' ? (
                                    <button 
                                        onClick={() => setSelectedVideoId(video._id)}
                                        style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 600 }}
                                    >
                                        <Play size={18} fill="currentColor" /> Play Video
                                    </button>
                                ) : (
                                    <button disabled style={{ width: '100%', padding: '10px', background: '#f1f5f9', color: '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'not-allowed', fontWeight: 600 }}>
                                        {video.status === 'flagged' ? 'Restricted' : 'Analyzing...'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;