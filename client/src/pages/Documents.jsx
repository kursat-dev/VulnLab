import { useState } from 'react';
import axios from 'axios';
import { FileText, AlertTriangle, Eye } from 'lucide-react';

const Documents = () => {
    const [docId, setDocId] = useState('');
    const [document, setDocument] = useState(null);
    const [error, setError] = useState('');

    const fetchDocument = async (e) => {
        if (e) e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/documents/${docId}`, {
                headers: { Authorization: token }
            });
            setDocument(res.data);
            setError('');
        } catch (err) {
            setError('Document not found or error accessing it.');
            setDocument(null);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="mb-8 p-6 glass-card border-l-4 border-l-red-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/10 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">IDOR Challenge</h2>
                        <p className="text-slate-400">
                            Insecure Direct Object References occur when an application provides direct access to objects based on user-supplied input.
                            <br />
                            Try to access a document ID that doesn't belong to you (e.g., ID 1 or 2).
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 mb-8">
                <form onSubmit={fetchDocument} className="flex gap-4">
                    <input
                        type="number"
                        placeholder="Enter Document ID (e.g., 1)"
                        className="input-field"
                        value={docId}
                        onChange={(e) => setDocId(e.target.value)}
                    />
                    <button type="submit" className="btn-primary w-auto px-8 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-center animate-fade-in">
                    {error}
                </div>
            )}

            {document && (
                <div className="glass-card p-8 animate-slide-up border border-primary/30">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                        <FileText className="w-6 h-6 text-primary" />
                        <h3 className="text-2xl font-bold">{document.title}</h3>
                        <span className="ml-auto text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                            ID: {document.id}
                        </span>
                    </div>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 whitespace-pre-wrap">{document.content}</p>
                    </div>
                    <div className="mt-8 pt-4 border-t border-white/10 text-sm text-slate-500">
                        Owner User ID: {document.user_id}
                        {/* Hinting at the IDOR */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Documents;
