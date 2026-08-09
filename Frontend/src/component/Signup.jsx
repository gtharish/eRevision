import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import NotesContext from "../context/NotesContext";

export default function Signup() {
    const navigate = useNavigate();
    const { Signup } = useContext(NotesContext);
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const data = await Signup(user);
        if (data.success) {
            navigate("/");
        } else {
            setError(data.message || "Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-page">
            <div className="w-full max-w-md bg-card border border-border-custom p-8 rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-center text-text-main mb-6">Sign Up</h1>

                {error && (
                    <p className="text-red-600 text-sm text-center mb-4">{error}</p>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full border border-border-custom rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="w-full border border-border-custom rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="w-full border border-border-custom rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary"
                    />

                    <button
                        className="w-full bg-primary hover:bg-primary-hover text-white p-3 rounded-lg transition duration-200"
                        type="submit"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-sm text-text-secondary text-center mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
