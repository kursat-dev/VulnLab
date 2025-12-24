import { useState } from 'react';
import axios from 'axios';
import { Search as SearchIcon, AlertTriangle } from 'lucide-react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [rawHtml, setRawHtml] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/api/search?q=${query}`);
            setResults(res.data.results);

            // To simulate the reflected XSS "feeling" in a SPA where the server returns JSON:
            // We manually construct the "reflected" HTML message based on server response
            // In a real old-school app, the server would return the full HTML page with the payload injected.

            const unsafeMessage = `Search results for: <b>${res.data.query}</b>`;
            setRawHtml(unsafeMessage);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 animate-fade-in">
            <div className="mb-8 p-6 glass-card border-l-4 border-l-yellow-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-500/10 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Reflected XSS Challenge</h2>
                        <p className="text-slate-400">
                            Reflected XSS occurs when an application receives data in an HTTP request and includes that data within the immediate response in an unsafe way.
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 mb-8">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="input-field pr-12"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-2 p-2 bg-primary rounded-lg text-white hover:bg-primary/90 transition-colors">
                        <SearchIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>

            {results && (
                <div className="space-y-4">
                    {/* VULNERABLE SECTION */}
                    <div className="p-4 border border-yellow-500/30 bg-yellow-500/5 rounded-lg">
                        <p className="text-sm text-yellow-200 mb-2 font-mono">Server Response Reflection:</p>
                        <div
                            className="text-lg text-white"
                            dangerouslySetInnerHTML={{ __html: rawHtml }}
                        />
                    </div>

                    <div className="glass-card p-4">
                        <h3 className="font-bold mb-4 text-slate-300">Results Found:</h3>
                        {results.map(r => (
                            <div key={r.id} className="p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                {r.title}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
