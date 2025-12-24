import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Database, FileCode } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();

    const modules = [
        {
            title: "SQL Injection",
            description: "Bypass authentication without knowing the password using classic SQLi technique.",
            icon: Database,
            path: "/login",
            color: "text-blue-400",
            bg: "bg-blue-400/10"
        },
        {
            title: "IDOR",
            description: "Access other users' private documents by manipulating IDs in the URL.",
            icon: Lock,
            path: "/documents",
            color: "text-red-400",
            bg: "bg-red-400/10"
        },
        {
            title: "Stored XSS",
            description: "Inject malicious scripts into the Guestbook that execute for other visitors.",
            icon: FileCode,
            path: "/guestbook",
            color: "text-green-400",
            bg: "bg-green-400/10"
        },
        {
            title: "Reflected XSS",
            description: "Inject malicious scripts via search query parameter.",
            icon: FileCode,
            path: "/search",
            color: "text-yellow-400",
            bg: "bg-yellow-400/10"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-accent">
                    Welcome to VulnLab
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    A safe environment to practice attacking unsafe applications.
                    Explore the modules below to understand common security vulnerabilities.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, index) => (
                    <div
                        key={index}
                        className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                        onClick={() => navigate(module.path)}
                    >
                        <div className={`w-12 h-12 ${module.bg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <module.icon className={`w-6 h-6 ${module.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                        <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                            {module.description}
                        </p>
                        <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                            <span>Launch Module</span>
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 p-6 bg-slate-900/50 rounded-xl border border-dashed border-slate-700 text-center">
                <p className="text-slate-500 text-sm">
                    ⚠️ Disclaimer: This application IS VULNERABLE. Do not deploy this on a public network without proper isolation.
                    For educational purposes only.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
