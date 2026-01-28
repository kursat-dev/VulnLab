import { useState } from 'react';
import axios from 'axios';
import { Terminal, ShieldAlert, Loader2 } from 'lucide-react';

const PingCommand = () => {
    const [ip, setIp] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePing = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/api/ping', { ip });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setResult({ output: "Error executing command." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 animate-fade-in">
            <div className="mb-8 p-6 glass-card border-l-4 border-l-red-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/10 rounded-full">
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Command Injection Challenge</h2>
                        <p className="text-slate-400">
                            Command injection is a vulnerability where an attacker can execute arbitrary operating system commands on the server.
                            Try to "chain" commands using <code>;</code>, <code>&</code>, or <code>||</code>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 mb-8">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-primary" />
                    Network Diagnostics: Ping Tool
                </h3>
                <form onSubmit={handlePing} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">IP Address / Hostname</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="e.g., 127.0.0.1"
                                className="input-field"
                                value={ip}
                                onChange={(e) => setIp(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Ping
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {result && (
                <div className="glass-card overflow-hidden bg-black/40 border-slate-800">
                    <div className="bg-slate-800/50 p-3 flex items-center justify-between border-b border-slate-700">
                        <span className="text-xs font-mono text-slate-400">Terminal Output</span>
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                    </div>
                    <div className="p-4">
                        <p className="text-primary font-mono text-sm mb-2">$ {result.command}</p>
                        <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                            {result.output}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PingCommand;
