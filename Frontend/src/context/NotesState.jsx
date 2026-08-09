import { useState, useEffect } from "react";
import NotesContext from "./NotesContext";

const host = import.meta.env.VITE_API_URL ;

export default function NotesState(props) {
    const [Subject, setSubject] = useState([]);
    const [Notes, setNotes] = useState([]);
    const [credential, setCredential] = useState(!!localStorage.getItem("authToken"));
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // signup
    const Signup = async (user) => {
        const { username, email, password } = user;
        const response = await fetch(`${host}/eRevision/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.status === 409) {
            alert("this user already exists, please login");
        } else if (response.status === 201) {
            localStorage.setItem("authToken", data.authToken);
            setCredential(true);
        }
        return data;
    };

    // login
    const Login = async (user) => {
        const { email, password } = user;
        const response = await fetch(`${host}/eRevision/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem("authToken", data.authToken);
            setCredential(true);
        }
        return data;
    };

    // fetch all subjects (with note counts)
    const fetchNotes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${host}/eRevision/getNotes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authToken: localStorage.getItem("authToken")
                }
            });
            const data = await response.json();
            if (data.success) {
                setSubject(data.subject);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (credential) {
            fetchNotes();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [credential]);

    // create a new subject + first note
    const createNotes = async ({ subject, title, tag, description }) => {
        const response = await fetch(`${host}/eRevision/createNotes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            },
            body: JSON.stringify({ subject, title, tag, description })
        });
        const data = await response.json();
        if (data.success) {
            setSubject([...Subject, { ...data.sub, noteCount: 1 }]);
            setNotes(Notes.concat(data.note));
        }
        return data;
    };

    // add a note to an existing subject
    const addNoteToSubject = async (subjectId, note) => {
        const { title, tag, description } = note;
        const response = await fetch(`${host}/eRevision/addNote/${subjectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            },
            body: JSON.stringify({ title, tag, description })
        });
        return await response.json();
    };

    // fetch notes for one subject, optional sort: "newest" | "oldest"
    const fetchSubjectNotes = async (id, sort = "newest") => {
        const response = await fetch(`${host}/eRevision/getNotes/${id}?sort=${sort}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            }
        });
        return await response.json();
    };

    // toggle favorite/pin on a note
    const toggleFavorite = async (id) => {
        const response = await fetch(`${host}/eRevision/toggleFavorite/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            }
        });
        return await response.json();
    };

    // fetch logged-in user's profile + stats
    const fetchProfile = async () => {
        const response = await fetch(`${host}/eRevision/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            }
        });
        return await response.json();
    };

    // update a note
    const updateNote = async (id, note) => {
        const { title, tag, description } = note;
        const response = await fetch(`${host}/eRevision/updateNotes/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            },
            body: JSON.stringify({ title, tag, description })
        });
        return await response.json();
    };

    // delete a note
    const deleteNote = async (id) => {
        const response = await fetch(`${host}/eRevision/deleteNotes/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            }
        });
        return await response.json();
    };

    // rename a subject
    const updateSubjectName = async (id, subject) => {
        const response = await fetch(`${host}/eRevision/updateSubject/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            },
            body: JSON.stringify({ subject })
        });
        const data = await response.json();
        if (data.success) {
            setSubject(Subject.map((s) => (s._id === id ? { ...s, subject: data.sub.subject } : s)));
        }
        return data;
    };

    // delete a subject and all its notes
    const deleteSubject = async (id) => {
        const response = await fetch(`${host}/eRevision/deleteSubject/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authToken: localStorage.getItem("authToken")
            }
        });
        const data = await response.json();
        if (data.success) {
            setSubject(Subject.filter((s) => s._id !== id));
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setCredential(false);
        setSubject([]);
        setNotes([]);
    };

    return (
        <NotesContext.Provider
            value={{
                Subject,
                Notes,
                Signup,
                Login,
                logout,
                credential,
                setCredential,
                createNotes,
                addNoteToSubject,
                fetchSubjectNotes,
                updateNote,
                deleteNote,
                updateSubjectName,
                deleteSubject,
                toggleFavorite,
                fetchProfile,
                loading,
                searchTerm,
                setSearchTerm
            }}
        >
            {props.children}
        </NotesContext.Provider>
    );
}
