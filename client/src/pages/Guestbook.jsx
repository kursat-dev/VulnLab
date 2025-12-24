import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, AlertTriangle, Send } from 'lucide-react';

const Guestbook = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [status, setStatus] = useState('');

    const fetchComments = async () => {
        try {
            const res = await axios.get('/api/comments');
            setComments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/comments', { content: newComment }, {
                headers: { Authorization: token }
            });
            setNewComment('');
            setStatus('Comment posted!');
            fetchComments();
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus('Failed to post comment');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-fade-in">
            <div className="mb-8 p-6 glass-card border-l-4 border-l-green-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-500/10 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Stored XSS Challenge</h2>
                        <p className="text-slate-400">
                            Stored Cross-Site Scripting (XSS) occurs when the application stores user input that is not safely sanitized.
                            <br />
                            Try posting a comment with HTML/JS like: <code>&lt;img src=x onerror=alert(1)&gt;</code>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Comment Form */}
                <div className="glass-card p-6 h-fit">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        Sign Guestbook
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <textarea
                            className="input-field min-h-[100px]"
                            placeholder="Write something..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="btn-primary flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" />
                            Post Comment
                        </button>
                        {status && <p className="text-sm text-center text-primary">{status}</p>}
                    </form>
                </div>

                {/* Comments Display */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold mb-4 text-slate-300">Recent Comments</h3>
                    {comments.map((comment) => (
                        <div key={comment.id} className="glass-card p-4 animate-slide-up">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-primary">@{comment.username}</span>
                                <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            {/* VULNERABILITY: RENDER PRE-HTML */}
                            <div
                                className="text-slate-300 break-words"
                                dangerouslySetInnerHTML={{ __html: comment.content }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Guestbook;
