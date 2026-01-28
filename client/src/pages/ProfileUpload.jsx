import { useState } from 'react';
import axios from 'axios';
import { Upload, User, ShieldAlert, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

const ProfileUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
        setUploadResult(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        const token = localStorage.getItem('token');

        try {
            const res = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token
                }
            });
            setUploadResult(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 animate-fade-in">
            <div className="mb-8 p-6 glass-card border-l-4 border-l-purple-500">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-full">
                        <ShieldAlert className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">Unrestricted File Upload Challenge</h2>
                        <p className="text-slate-400">
                            Unrestricted file upload is when an application allows users to upload files without properly validating their types or content.
                            Try uploading non-image files like <code>.html</code> or <code>.php</code> (if the server supports it).
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-card p-8 text-center">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-primary/30 overflow-hidden">
                    {uploadResult ? (
                        <img
                            src={`http://localhost:3000${uploadResult.path}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Preview'; }}
                        />
                    ) : (
                        <User className="w-12 h-12 text-slate-500" />
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">Update Profile Picture</h3>
                <p className="text-slate-400 mb-8 text-sm">Upload your avatar to personalize your profile.</p>

                <form onSubmit={handleUpload} className="max-w-xs mx-auto space-y-4">
                    <div className="relative group">
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl hover:border-primary/50 hover:bg-slate-800/80 cursor-pointer transition-all group-hover:scale-[1.02]"
                        >
                            <Upload className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium text-slate-300">
                                {file ? file.name : "Choose a file"}
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        Upload Avatar
                    </button>
                </form>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {uploadResult && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-scale-in">
                        <div className="flex items-center gap-2 text-green-400 font-bold mb-2 justify-center">
                            <CheckCircle className="w-5 h-5" />
                            Upload Successful
                        </div>
                        <p className="text-slate-400 text-xs mb-3">
                            File: {uploadResult.filename}
                        </p>
                        <a
                            href={`http://localhost:3000${uploadResult.path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-xs hover:underline flex items-center justify-center gap-1"
                        >
                            View File Externally
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileUpload;
