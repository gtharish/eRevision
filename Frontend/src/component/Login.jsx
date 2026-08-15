import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import NotesContext from "../context/NotesContext";

export default function Login() {
    const navigate = useNavigate();
    const { Login } = useContext(NotesContext);
    const [user, setUser] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const {  guestLogin } = useContext(NotesContext);
// ...
const [guestLoading, setGuestLoading] = useState(false);
const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);
    const data = await guestLogin();
    setGuestLoading(false);
    if (data.success) {
        navigate("/");
    } else {
        setError("Could not start guest session. Please try again.");
    }
};

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const data = await Login(user);
        if (data.success) {
            navigate("/");
        } else {
            setError(data.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-page">
            <div className="w-full max-w-md bg-card border border-border-custom p-8 rounded-xl shadow-sm">
                <h1 className="text-3xl font-bold text-center text-text-main mb-6">Login</h1>

                {error && (
                    <p className="text-red-600 text-sm text-center mb-4">{error}</p>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
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
                        Login
                    </button>
                </form>
                <div className="flex items-center gap-3 my-5">
    <div className="flex-1 h-px bg-border-custom" />
    <span className="text-xs text-text-secondary">OR</span>
    <div className="flex-1 h-px bg-border-custom" />
</div>

<button
    onClick={handleGuestLogin}
    disabled={guestLoading}
    className="w-full border border-border-custom text-text-main p-3 rounded-lg hover:bg-selected transition duration-200 disabled:opacity-60"
>
    {guestLoading ? "Starting guest session..." : "Continue as Guest"}
</button>
<p className="text-xs text-text-secondary text-center mt-2">
    Try the app instantly — no signup needed. Your data is cleared when you log out.
</p>

                <p className="text-sm text-text-secondary text-center mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
