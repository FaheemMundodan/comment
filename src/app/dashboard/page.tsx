'use client';

import { useState, useEffect } from 'react';
import { Copy, ExternalLink, CheckCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [comment, setComment] = useState<any>(null);
    const [reelLink, setReelLink] = useState('');
    const [fbLink, setFbLink] = useState('');
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/user/comment');
            const data = await res.json();
            setComment(data.comment);
            setReelLink(data.latest_reel_link);
            setFbLink(data.latest_fb_link);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleCopy = async () => {
        if (!comment?.text) return;
        try {
            await navigator.clipboard.writeText(comment.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.replace('/');
    };

    if (loading) return <div className="container"><div className="loader mx-auto" style={{ marginTop: '40vh' }}></div></div>;

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', padding: '24px 20px', justifyContent: 'center', position: 'relative' }}>
            <button onClick={handleLogout} className="btn-secondary" style={{ position: 'absolute', top: 24, right: 20, padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', width: 'auto' }}>
                <LogOut size={16} /> Logout
            </button>

            <h2 className="mb-8 text-center" style={{ fontSize: '24px' }}>Your Active Task</h2>

            {!comment ? (
                <div className="glass-panel text-center" style={{ padding: '40px 24px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', width: 64, height: 64, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 24 }}>🕒</span>
                    </div>
                    <p className="text-secondary mb-4" style={{ fontSize: '18px', fontWeight: 500 }}>No comments available right now.</p>
                    <p className="text-secondary">Great job! You've caught up. Please check back later when new tasks arrive.</p>
                </div>
            ) : (
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    <div>
                        <label className="label flex-between mb-4">
                            Assigned Comment
                            {copied && <span className="text-success flex-item-center" style={{ fontSize: 14, fontWeight: 600 }}><CheckCircle size={16} /> Copied!</span>}
                        </label>
                        <div
                            style={{
                                background: 'rgba(0,0,0,0.3)',
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid var(--border)',
                                fontSize: '18px',
                                lineHeight: '1.6',
                                position: 'relative',
                                margin: '8px 0',
                                color: 'white',
                                fontWeight: 500
                            }}
                        >
                            {comment.text}
                        </div>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="btn btn-secondary"
                        style={{
                            borderColor: copied ? 'var(--success)' : 'var(--border)',
                            color: copied ? 'var(--success)' : 'var(--text-primary)',
                            padding: '18px 24px'
                        }}
                    >
                        {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                        {copied ? 'Copied to Clipboard' : 'Copy Comment Text'}
                    </button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {reelLink && (
                            <a
                                href={reelLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                                style={{ textDecoration: 'none', padding: '16px', fontSize: '18px' }}
                            >
                                <ExternalLink size={20} />
                                Go to Instagram Reel
                            </a>
                        )}

                        {fbLink && (
                            <a
                                href={fbLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                                style={{
                                    textDecoration: 'none',
                                    padding: '16px',
                                    fontSize: '18px'
                                }}
                            >
                                <ExternalLink size={20} />
                                Go to Facebook Video
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
