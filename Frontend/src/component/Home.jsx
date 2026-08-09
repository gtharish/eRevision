import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import NotesContext from "../context/NotesContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "./ConfirmDialog";

export default function Home() {
    const { Subject, loading, searchTerm, deleteSubject } = useContext(NotesContext);
    const { showToast } = useToast();
    const [confirmId, setConfirmId] = useState(null);

    const filteredSubjects = Subject.filter((sub) =>
        sub.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const askDelete = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirmId(id);
    };

    const handleConfirm = async () => {
        const id = confirmId;
        setConfirmId(null);
        const data = await deleteSubject(id);
        if (data.success) {
            showToast("Subject deleted");
        } else {
            showToast("Could not delete subject", "error");
        }
    };

    return (
        <div className="bg-page min-h-screen">
            <ConfirmDialog
                open={!!confirmId}
                title="Delete subject?"
                message="This will permanently delete the subject and all its notes."
                onConfirm={handleConfirm}
                onCancel={() => setConfirmId(null)}
            />

            <div className="border-b border-border-custom py-4 px-6">
                <h1 className="text-3xl font-bold text-text-main text-center">Subjects</h1>
                <p className="text-text-secondary mt-1 text-center">
                    Select a subject to view your revision notes.
                </p>
            </div>

            {loading ? (
                <p className="text-center mt-6 text-text-secondary">Loading subjects...</p>
            ) : Subject.length === 0 ? (
                <div className="text-center mt-6">
                    <p className="text-text-secondary mb-3">You have no subjects yet.</p>
                    <Link to="/createNotes" className="text-primary hover:underline">
                        Create your first subject
                    </Link>
                </div>
            ) : filteredSubjects.length === 0 ? (
                <p className="text-center mt-6 text-text-secondary">
                    No subjects match "{searchTerm}".
                </p>
            ) : (
                <div className="px-4 pb-4">
                    {filteredSubjects.map((sub) => (
                        <Link key={sub._id} to={`notes/${sub._id}`} className="block">
                            <div className="w-full h-24 bg-card border border-border-custom rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between px-6 cursor-pointer mt-3">
                                <div>
                                    <h2 className="text-xl font-semibold text-text-main">{sub.subject}</h2>
                                    <p className="text-sm text-text-secondary">
                                        {sub.noteCount ?? 0} {sub.noteCount === 1 ? "note" : "notes"}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={(e) => askDelete(e, sub._id)}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                    <span className="text-text-secondary text-2xl">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
