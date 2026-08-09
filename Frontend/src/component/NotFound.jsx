import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-page flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <p className="text-text-main text-lg mb-2">Page not found</p>
            <p className="text-text-secondary mb-6">
                The page you're looking for doesn't exist or may have been moved.
            </p>
            <Link
                to="/"
                className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-hover transition duration-200"
            >
                Back to Home
            </Link>
        </div>
    );
}
