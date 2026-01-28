import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Search, AlertCircle, FileBox } from 'lucide-react';

const LogViewer = () => {
    const [fileName, setFileName] = useState('logs.txt');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const fetchLogs = async (file) => {
        try {
            setError(null);
            const res = await axios.get(`/api/logs?file=${file}`);
            setContent(res.data);
        } catch (err) {
            setError("Could not load log file.");
            setContent('');
        }
    };

    useEffect(() => {
        fetchLogs(fileName);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchLogs(fileName);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="mb-8 p-6 glass-card border-l-4 border-l-blue-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-full">
                        <AlertCircle className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Local File Inclusion Challenge</h2>
                        <p className="text-slate-400">
                            LFI allows an attacker to include files on a server through the web browser.
                            Try to navigate outside the intended directory using <code>../</code>.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                            <FileBox className="w-4 h-4" />
                            System Logs
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => { setFileName('logs.txt'); fetchLogs('logs.txt'); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${fileName === 'logs.txt' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-400 hover:bg-white/5'}`}
                            >
                                logs.txt
                            </button>
                            <button
                                onClick={() => { setFileName('server_info.txt'); fetchLogs('server_info.txt'); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${fileName === 'server_info.txt' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-400 hover:bg-white/5'}`}
                            >
                                server_info.txt
                            </button>
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Custom Path</h3>
                        <form onSubmit={handleSubmit} className="relative">
                            <input
                                type="text"
                                className="input-field text-xs pr-8 py-2"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="glass-card h-full min-h-[400px] flex flex-col bg-slate-900/50">
                        <div className="p-4 border-b border-white/5 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm font-mono text-slate-300">{fileName}</span>
                        </div>
                        <div className="flex-1 p-6 font-mono text-sm overflow-auto max-h-[600px]">
                            {error ? (
                                <div className="text-red-400 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            ) : (
                                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {content || "Loading file..."}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogViewer;
