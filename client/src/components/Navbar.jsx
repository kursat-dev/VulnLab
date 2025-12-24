import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, FileText, MessageSquare, Search as SearchIcon } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!token) return null;

    return (
        <nav className="bg-surface border-b border-white/10 shadow-lg mb-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl hover:text-primary/80 transition-colors">
                        <ShieldAlert className="w-8 h-8" />
                        <span>VulnLab</span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <Link to="/documents" className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors">
                            <FileText className="w-5 h-5" />
                            <span>Documents (IDOR)</span>
                        </Link>
                        <Link to="/guestbook" className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors">
                            <MessageSquare className="w-5 h-5" />
                            <span>Guestbook (Stored XSS)</span>
                        </Link>
                        <Link to="/search" className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors">
                            <SearchIcon className="w-5 h-5" />
                            <span>Search (Reflected XSS)</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-slate-400">
                            Logged in as <span className="text-white font-medium">{user.username}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-danger transition-colors rounded-lg hover:bg-white/5"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
