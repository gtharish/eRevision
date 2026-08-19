import { useState, useEffect } from "react";
import NotesContext from "./NotesContext";
import { useToast } from "./ToastContext";

const host = import.meta.env.VITE_API_URL;

export default function NotesState(props) {
    const { showToast } = useToast();

    const [Subject, setSubject] = useState([]);
    const [Notes, setNotes] = useState([]);
    const [credential, setCredential] = useState(
        !!localStorage.getItem("authToken")
    );
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isGuest, setIsGuest] = useState(
        localStorage.getItem("isGuest") === "true"
    );

    // signup
    const Signup = async (user) => {
        try {
            const { username, email, password } = user;

            const response = await fetch(`${host}/eRevision/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.status === 409) {
                showToast("This user already exists, please login", "error");
            } else if (response.status === 201) {
                localStorage.setItem("authToken", data.authToken);
                setCredential(true);
                showToast("Signup successful");
            } else {
                showToast(data.message || "Signup failed", "error");
            }

            return data;
        } catch (e) {
            showToast("Something went wrong during signup", "error");
            console.error(e);
        }
    };

    // login
    const Login = async (user) => {
        try {
            const { email, password } = user;

            const response = await fetch(`${host}/eRevision/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("authToken", data.authToken);
                setCredential(true);
                showToast("Login successful");
            } else {
                showToast(data.message || "Login failed", "error");
            }

            return data;
        } catch (e) {
            showToast("Something went wrong during login", "error");
            console.error(e);
        }
    };

    // guest login
    const guestLogin = async () => {
        try {
            const response = await fetch(`${host}/eRevision/guest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("authToken", data.authToken);
                localStorage.setItem("isGuest", "true");

                setIsGuest(true);
                setCredential(true);

                showToast("Guest session started");
            } else {
                showToast(
                    data.message || "Unable to start guest session",
                    "error"
                );
            }

            return data;
        } catch (e) {
            showToast("Something went wrong", "error");
            console.error(e);
        }
    };

    // fetch all subjects
    const fetchNotes = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${host}/eRevision/getNotes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setSubject(data.subject);
            }
            else{
                setCredential(false);
                showToast("Invalid User!!!","error");
            }
        } catch (e) {
            console.error(e);
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

        
    }, [credential]);

    // create a new subject + first note
    const createNotes = async ({
        subject,
        title,
        tag,
        description
    }) => {
        try {
            const response = await fetch(`${host}/eRevision/createNotes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`
                },
                body: JSON.stringify({
                    subject,
                    title,
                    tag,
                    description
                })
            });

            const data = await response.json();

            if (data.success) {
                setSubject([
                    ...Subject,
                    {
                        ...data.sub,
                        noteCount: 1
                    }
                ]);

                setNotes(Notes.concat(data.note));

                showToast("Note created successfully");
            } else {
                showToast(data.message || "Failed to create note", "error");
            }

            return data;
        } catch (e) {
            showToast("Something went wrong while creating the note", "error");
            console.error(e);
        }
    };

    // add a note to an existing subject
    const addNoteToSubject = async (subjectId, note) => {
        try {
            const { title, tag, description } = note;

            const response = await fetch(
                `${host}/eRevision/addNote/${subjectId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`
                    },
                    body: JSON.stringify({
                        title,
                        tag,
                        description
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                showToast("Note added successfully");
            } else {
                showToast(data.message || "Failed to add note", "error");
            }

            return data;
        } catch (e) {
            showToast("Something went wrong while adding the note", "error");
            console.error(e);
        }
    };

    // fetch notes for one subject
    const fetchSubjectNotes = async (id, sort = "newest") => {
        try {
            const response = await fetch(
                `${host}/eRevision/getNotes/${id}?sort=${sort}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`
                    }
                }
            );

            return await response.json();
        } catch (e) {
            console.error(e);
            return {
                success: false,
                message: "Failed to fetch notes"
            };
        }
    };

    // toggle favorite/pin on a note
    const toggleFavorite = async (id) => {
        try {
            const response = await fetch(
                `${host}/eRevision/toggleFavorite/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                showToast("Favorite updated");
            } else {
                showToast(data.message || "Failed to update favorite", "error");
            }

            return data;
        } catch (e) {
            showToast("Something went wrong", "error");
            console.error(e);
        }
    };

    // fetch logged-in user's profile + stats
    const fetchProfile = async () => {
        try {
            const response = await fetch(`${host}/eRevision/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "authToken"
                    )}`
                }
            });

            return await response.json();
        } catch (e) {
            console.error(e);

            return {
                success: false,
                message: "Failed to fetch profile"
            };
        }
    };

    // update a note
    const updateNote = async (id, note) => {
        try {
            const { title, tag, description } = note;

            const response = await fetch(
                `${host}/eRevision/updateNotes/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`
                    },
                    body: JSON.stringify({
                        title,
                        tag,
                        description
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                showToast("Note updated successfully");
            } else {
                showToast(data.message || "Failed to update note", "error");
            }

            return data;
        } catch (e) {
            showToast("Something went wrong while updating the note", "error");
            console.error(e);
        }
    };

    // delete a note
    const deleteNote = async (id) => {
        try {
            const response = await fetch(
                `${host}/eRevision/deleteNotes/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                showToast("Note deleted successfully");
            } else {
                showToast(data.message || "Failed to delete note", "error");
            }

            return data;
        } catch (e) {
            showToast("Something went wrong while deleting the note", "error");
            console.error(e);
        }
    };

    // rename a subject
    const updateSubjectName = async (id, subject) => {
        try {
            const response = await fetch(
                `${host}/eRevision/updateSubject/${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`
                    },
                    body: JSON.stringify({
                        subject
                    })
                }
            );

            const data = await response.json();

            if (data.success) {
                setSubject(
                    Subject.map((s) =>
                        s._id === id
                            ? {
                                  ...s,
                                  subject: data.sub.subject
                              }
                            : s
                    )
                );

                showToast("Subject updated successfully");
            } else {
                showToast(
                    data.message || "Failed to update subject",
                    "error"
                );
            }

            return data;
        } catch (e) {
            showToast(
                "Something went wrong while updating the subject",
                "error"
            );
            console.error(e);
        }
    };

    // delete a subject and all its notes
    const deleteSubject = async (id) => {
        try {
            const response = await fetch(
                `${host}/eRevision/deleteSubject/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`
                    }
                }
            );

            const data = await response.json();

            if (data.success) {
                setSubject(Subject.filter((s) => s._id !== id));

                showToast("Subject and its notes deleted");
            } else {
                showToast(
                    data.message || "Failed to delete subject",
                    "error"
                );
            }

            return data;
        } catch (e) {
            showToast(
                "Something went wrong while deleting the subject",
                "error"
            );
            console.error(e);
        }
    };

    // logout
    const logout = async () => {
        if (isGuest) {
            try {
                await fetch(`${host}/eRevision/guest-cleanup`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`
                    }
                });
            } catch (e) {
                console.error("guest cleanup failed:", e.message);
            }
        }

        localStorage.removeItem("authToken");
        localStorage.removeItem("isGuest");

        setIsGuest(false);
        setCredential(false);
        setSubject([]);
        setNotes([]);

        showToast("Logged out successfully");
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
                setSearchTerm,
                guestLogin
            }}
        >
            {props.children}
        </NotesContext.Provider>
    );
}