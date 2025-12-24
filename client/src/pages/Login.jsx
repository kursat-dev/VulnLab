import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Info } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Using logic that connects to our vulnerable backend
            const res = await axios.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md z-10 glass-card p-8 animate-fade-in">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-4 bg-white/5 rounded-full mb-4">
                        <ShieldAlert className="w-12 h-12 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        VulnLab Login
                    </h2>
                    <p className="text-slate-400 mt-2">Intentionally Vulnerable Interface</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2 animate-slide-up">
                        <Info className="w-4 h-4 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn-primary">
                        Sign In
                    </button>
                </form>

                <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                    <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        Hint for Students:
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Try a classic SQL Injection payload in the username field:
                        <br />
                        <code className="bg-slate-800 px-1 py-0.5 rounded text-primary mt-1 inline-block">admin' --</code>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
