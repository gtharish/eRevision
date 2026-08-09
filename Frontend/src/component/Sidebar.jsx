import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import NotesContext from "../context/NotesContext";

export default function Sidebar() {
    const { Subject, loading } = useContext(NotesContext);
    const location = useLocation();

    return (
        <aside className="w-72 h-screen border-r border-border-custom bg-sidebar flex flex-col">
            <Link
                to="/createNotes"
                className="m-4 p-3 rounded-lg bg-primary text-white hover:bg-primary-hover text-center"
            >
                + New Subject
            </Link>

            <div className="px-4">
                <Link
                    to="/"
                    className={`block w-full text-left p-2 rounded text-text-main hover:bg-selected ${
                        location.pathname === "/" ? "bg-selected font-medium" : ""
                    }`}
                >
                    📂 All Subjects
                </Link>
            </div>

            <hr className="my-4 border-border-custom" />

            <div className="flex-1 overflow-y-auto px-4">
                <h3 className="text-sm text-text-secondary mb-3">SUBJECTS</h3>

                {loading ? (
                    <p className="text-sm text-text-secondary">Loading...</p>
                ) : Subject.length === 0 ? (
                    <p className="text-sm text-text-secondary">No subjects yet.</p>
                ) : (
                    <div className="space-y-2">
                        {Subject.map((sub) => (
                            <Link
                                key={sub._id}
                                to={`/notes/${sub._id}`}
                                className={`block w-full text-left p-2 rounded text-text-main hover:bg-selected ${
                                    location.pathname === `/notes/${sub._id}` ? "bg-selected font-medium" : ""
                                }`}
                            >
                                {sub.subject}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
