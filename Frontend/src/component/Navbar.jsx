import { useContext } from "react";
import { Link } from "react-router-dom";
import NotesContext from "../context/NotesContext";

export default function Navbar() {
    const { credential, logout, searchTerm, setSearchTerm } = useContext(NotesContext);

    return (
        <nav className="h-16 flex items-center justify-between px-6 border-b border-border-custom bg-card">
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-bold text-primary">eRevision</h1>
                <Link to="/" className="font-medium text-text-main hover:text-primary">
                    Home
                </Link>
                {credential && (
                    <Link to="/dashboard" className="font-medium text-text-main hover:text-primary">
                        Dashboard
                    </Link>
                )}
            </div>

            {credential && (
                <div className="w-[420px]">
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-border-custom rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary text-text-main"
                    />
                </div>
            )}

            <div className="flex items-center gap-4">
                {!credential ? (
                    <>
                        <Link
                            to="/login"
                            className="px-4 py-2 text-text-main font-medium rounded-lg hover:bg-selected transition duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition duration-200"
                        >
                            Sign Up
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
