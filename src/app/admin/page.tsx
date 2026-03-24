'use client';

import { useState, useEffect } from 'react';
import { LogOut, Trash2, Plus, Users, Save, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [newComments, setNewComments] = useState('');
    const [reelLink, setReelLink] = useState('');
    const [fbLink, setFbLink] = useState('');
    const [commentCount, setCommentCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, settingsRes] = await Promise.all([
                fetch('/api/admin/users'),
                fetch('/api/admin/settings')
            ]);
            const usersData = await usersRes.json();
            const settingsData = await settingsRes.json();

            setUsers(usersData.users || []);
            setCommentCount(usersData.commentCount || 0);
            setReelLink(settingsData.latest_reel_link || '');
            setFbLink(settingsData.latest_fb_link || '');
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleAddComments = async () => {
        const list = newComments.split('\n').filter(s => s.trim());
        if (!list.length) return;

        await fetch('/api/admin/comments/add', {
            method: 'POST',
            body: JSON.stringify({ comments: list })
        });
        setNewComments('');
        showToast(`Added ${list.length} comments!`);
        fetchData();
    };

    const handleClearComments = async () => {
        if (!confirm('Are you sure you want to clear ALL comments and unassign everyone?')) return;
        await fetch('/api/admin/comments/clear', { method: 'POST' });
        showToast('All comments cleared');
        fetchData();
    };

    const handleSaveLinks = async () => {
        await fetch('/api/admin/settings', {
            method: 'POST',
            body: JSON.stringify({
                latest_reel_link: reelLink,
                latest_fb_link: fbLink
            })
        });
        showToast('Links updated!');
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.replace('/');
    };

    if (loading) return <div className="container"><div className="loader mx-auto mt-8"></div></div>;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <header className="flex-between mb-8">
                <h2>Admin Panel</h2>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 12px', width: 'auto', fontSize: '14px' }}>
                    <LogOut size={16} /> Logout
                </button>
            </header>

            <section className="glass-panel mb-4">
                <h3 className="flex-item-center mb-4"><FileText size={20} className="text-primary" /> Comment Management</h3>

                {commentCount > 0 ? (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                        <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>
                            {commentCount}
                        </div>
                        <p className="text-secondary mb-8">Comments currently loaded in the system</p>
                        <button onClick={handleClearComments} className="btn btn-danger" style={{ maxWidth: '280px', margin: '0 auto' }}>
                            <Trash2 size={16} /> Delete All Comments
                        </button>
                        <p className="text-secondary mt-4" style={{ fontSize: '12px' }}>This will also reset all user assignments.</p>
                    </div>
                ) : (
                    <>
                        <label className="label">Paste one comment per line</label>
                        <textarea
                            className="input-field"
                            placeholder="Amazing reel! 🔥&#10;Love this format!! 🙌"
                            value={newComments}
                            onChange={(e) => setNewComments(e.target.value)}
                        />
                        <button onClick={handleAddComments} className="btn btn-primary mt-4">
                            <Plus size={16} /> Save Comments
                        </button>
                    </>
                )}
            </section>

            <section className="glass-panel mb-4">
                <h3 className="flex-item-center mb-4"><Save size={20} className="text-accent" /> Global Links</h3>
                <label className="label">Instagram Reel URL</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', marginBottom: '16px' }}>
                    <input
                        type="url"
                        className="input-field"
                        style={{ marginTop: 0 }}
                        placeholder="https://instagram.com/reel/..."
                        value={reelLink}
                        onChange={(e) => setReelLink(e.target.value)}
                    />
                </div>

                <label className="label">Facebook Video URL</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <input
                        type="url"
                        className="input-field"
                        style={{ marginTop: 0 }}
                        placeholder="https://facebook.com/video..."
                        value={fbLink}
                        onChange={(e) => setFbLink(e.target.value)}
                    />
                </div>
                <button onClick={handleSaveLinks} className="btn btn-primary mt-4">Update Links</button>
            </section>

            <section className="glass-panel mb-4" style={{ overflowX: 'auto' }}>
                <div className="flex-between mb-4">
                    <h3 className="flex-item-center"><Users size={20} /> Users & Assignments</h3>
                </div>

                {users.length === 0 ? <p className="text-secondary">No users found.</p> : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.phone}</td>
                                    <td>
                                        {u.assigned_comment_id
                                            ? <span className="badge badge-assigned">Assigned</span>
                                            : <span className="badge badge-unassigned">Waiting</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <div className={`toast ${toast ? 'show' : ''}`}>✅ {toast}</div>
        </div>
    );
}
