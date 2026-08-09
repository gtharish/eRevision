import { useContext } from "react";
import { Navigate } from "react-router-dom";
import NotesContext from "../context/NotesContext";

export default function ProtectedRoute({ children }) {
    const { credential } = useContext(NotesContext);
    if (!credential) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
