import { useState, useEffect, useContext } from "react";
import NotesContext from "../context/NotesContext";

export default function Dashboard() {
    const { fetchProfile } = useContext(NotesContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchProfile();
            if (data.success) {
                setProfile(data);
            }
            setLoading(false);
        };
        load();
    }, [fetchProfile]);

    if (loading) {
        return <p className="text-center mt-10 text-text-secondary">Loading profile...</p>;
    }

    if (!profile) {
        return <p className="text-center mt-10 text-text-secondary">Could not load profile.</p>;
    }

    const { user, stats } = profile;
    const joined = user.Date ? new Date(user.Date).toLocaleDateString() : null;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 bg-page min-h-screen">
            <h1 className="text-2xl font-bold text-text-main mb-6">Your Dashboard</h1>

            <div className="bg-card border border-border-custom rounded-xl p-6 mb-6">
                <p className="text-lg font-semibold text-text-main">{user.username}</p>
                <p className="text-text-secondary">{user.email}</p>
                {joined && (
                    <p className="text-sm text-text-secondary mt-1">Member since {joined}</p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border border-border-custom rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{stats.subjectCount}</p>
                    <p className="text-text-secondary mt-1">Subjects</p>
                </div>
                <div className="bg-card border border-border-custom rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{stats.noteCount}</p>
                    <p className="text-text-secondary mt-1">Notes</p>
                </div>
                <div className="bg-card border border-border-custom rounded-xl p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{stats.favoriteCount}</p>
                    <p className="text-text-secondary mt-1">Favorites</p>
                </div>
            </div>
        </div>
    );
}
