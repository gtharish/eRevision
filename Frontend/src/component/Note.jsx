import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotesContext from "../context/NotesContext";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "./ConfirmDialog";

export default function Note() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const {
        fetchSubjectNotes,
        updateNote,
        deleteNote,
        updateSubjectName,
        addNoteToSubject,
        deleteSubject,
        toggleFavorite
    } = useContext(NotesContext);

    const [notes, setNotes] = useState([]);
    const [sub, setSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("newest");

    const [openId, setOpenId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", description: "", tag: "" });

    const [editingSubject, setEditingSubject] = useState(false);
    const [subjectName, setSubjectName] = useState("");

    const [showAddForm, setShowAddForm] = useState(false);
    const [newNote, setNewNote] = useState({ title: "", description: "", tag: "" });

    const [activeTag, setActiveTag] = useState(null);

    const [confirmState, setConfirmState] = useState({ open: false, type: null, targetId: null });

    const loadNotes = async (sort = sortOrder) => {
        setLoading(true);
        const data = await fetchSubjectNotes(id, sort);
        if (data.success !== undefined) {
            setNotes(data.notes || []);
            setSub(data.sub || null);
            setSubjectName(data.sub ? data.sub.subject : "");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadNotes();
        setActiveTag(null);
        setOpenId(null);
        setEditingId(null);
        setShowAddForm(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSortChange = async (order) => {
        setSortOrder(order);
        await loadNotes(order);
    };

    const toggleOpen = (noteId) => {
        setOpenId(openId === noteId ? null : noteId);
    };

    const startEdit = (note) => {
        setEditingId(note._id);
        setEditForm({
            title: note.title || "",
            description: note.description || "",
            tag: Array.isArray(note.tag) ? note.tag.join(", ") : note.tag || ""
        });
        setOpenId(note._id);
    };

    const cancelEdit = () => setEditingId(null);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const saveEdit = async (noteId) => {
        const data = await updateNote(noteId, editForm);
        if (data.success) {
            setNotes(notes.map((n) => (n._id === noteId ? data.note : n)));
            setEditingId(null);
            showToast("Note updated");
        } else {
            showToast("Could not update note", "error");
        }
    };

    const handleFavorite = async (noteId) => {
        const data = await toggleFavorite(noteId);
        if (data.success) {
            setNotes(notes.map((n) => (n._id === noteId ? data.note : n)));
        }
    };

    const askDeleteNote = (noteId) => {
        setConfirmState({ open: true, type: "note", targetId: noteId });
    };

    const askDeleteSubject = () => {
        setConfirmState({ open: true, type: "subject", targetId: id });
    };

    const handleConfirm = async () => {
        const { type, targetId } = confirmState;
        setConfirmState({ open: false, type: null, targetId: null });

        if (type === "note") {
            const data = await deleteNote(targetId);
            if (data.success) {
                setNotes(notes.filter((n) => n._id !== targetId));
                showToast("Note deleted");
            } else {
                showToast("Could not delete note", "error");
            }
        } else if (type === "subject") {
            const data = await deleteSubject(targetId);
            if (data.success) {
                showToast("Subject deleted");
                navigate("/");
            } else {
                showToast("Could not delete subject", "error");
            }
        }
    };

    const handleCancelConfirm = () => {
        setConfirmState({ open: false, type: null, targetId: null });
    };

    const saveSubjectName = async () => {
        const data = await updateSubjectName(id, subjectName);
        if (data.success) {
            setSub(data.sub);
            setEditingSubject(false);
            showToast("Subject renamed");
        } else {
            showToast("Could not rename subject", "error");
        }
    };

    const handleNewNoteChange = (e) => {
        setNewNote({ ...newNote, [e.target.name]: e.target.value });
    };

    const submitNewNote = async () => {
        if (!newNote.title.trim()) return;
        const data = await addNoteToSubject(id, newNote);
        if (data.success) {
            setNotes([data.note, ...notes]);
            setNewNote({ title: "", description: "", tag: "" });
            setShowAddForm(false);
            showToast("Note added");
        } else {
            showToast("Could not add note", "error");
        }
    };

    const allTags = [
        ...new Set(notes.flatMap((n) => (Array.isArray(n.tag) ? n.tag : n.tag ? [n.tag] : [])))
    ];

    const visibleNotes = activeTag
        ? notes.filter((n) => (Array.isArray(n.tag) ? n.tag : [n.tag]).includes(activeTag))
        : notes;

    if (loading) {
        return <p className="text-center mt-10 text-text-secondary">Loading notes...</p>;
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 bg-page min-h-screen">
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.type === "subject" ? "Delete subject?" : "Delete note?"}
                message={
                    confirmState.type === "subject"
                        ? "This will permanently delete the subject and all its notes."
                        : "This note will be permanently deleted."
                }
                onConfirm={handleConfirm}
                onCancel={handleCancelConfirm}
            />

            {/* subject header */}
            <div className="flex items-center justify-between mb-6 border-b border-border-custom pb-4">
                {editingSubject ? (
                    <div className="flex items-center gap-2 w-full">
                        <input
                            type="text"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            className="border border-border-custom rounded px-3 py-2 flex-1"
                        />
                        <button
                            onClick={saveSubjectName}
                            className="bg-primary text-white px-3 py-2 rounded hover:bg-primary-hover"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditingSubject(false)}
                            className="bg-gray-200 px-3 py-2 rounded text-text-main"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-text-main">
                            {sub ? sub.subject : "Subject not found"}
                        </h1>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setEditingSubject(true)}
                                className="text-sm text-primary hover:underline"
                            >
                                Edit subject
                            </button>
                            <button
                                onClick={askDeleteSubject}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Delete subject
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* sort + tag filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                {allTags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTag(null)}
                            className={`text-sm px-3 py-1 rounded-full border border-border-custom ${
                                !activeTag
                                    ? "bg-primary text-white border-primary"
                                    : "bg-card text-text-secondary"
                            }`}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className={`text-sm px-3 py-1 rounded-full border border-border-custom ${
                                    activeTag === tag
                                        ? "bg-primary text-white border-primary"
                                        : "bg-card text-text-secondary"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div />
                )}

                {notes.length > 0 && (
                    <select
                        value={sortOrder}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="text-sm border border-border-custom rounded-lg px-3 py-1.5 text-text-main bg-card outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                )}
            </div>

            {/* add note */}
            <div className="mb-6">
                {showAddForm ? (
                    <div className="border border-border-custom rounded-lg bg-card p-4 space-y-3">
                        <input
                            type="text"
                            name="title"
                            value={newNote.title}
                            onChange={handleNewNoteChange}
                            placeholder="Title"
                            className="w-full border border-border-custom rounded px-3 py-2"
                        />
                        <textarea
                            name="description"
                            value={newNote.description}
                            onChange={handleNewNoteChange}
                            placeholder="Description"
                            rows="4"
                            className="w-full border border-border-custom rounded px-3 py-2 resize-none"
                        />
                        <input
                            type="text"
                            name="tag"
                            value={newNote.tag}
                            onChange={handleNewNoteChange}
                            placeholder="Tag"
                            className="w-full border border-border-custom rounded px-3 py-2"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={submitNewNote}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                            >
                                Save Note
                            </button>
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="bg-gray-200 px-4 py-2 rounded text-text-main"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                    >
                        + Add Note
                    </button>
                )}
            </div>

            {/* notes list */}
            {visibleNotes.length === 0 ? (
                <p className="text-text-secondary">
                    {notes.length === 0 ? "No notes in this subject yet." : "No notes with this tag."}
                </p>
            ) : (
                <div className="space-y-3">
                    {visibleNotes.map((note) => (
                        <div key={note._id} className="border border-border-custom rounded-lg bg-card">
                            <div className="flex items-center justify-between px-4 py-3">
                                <button
                                    onClick={() => toggleOpen(note._id)}
                                    className="text-left flex-1 font-medium text-text-main flex items-center gap-2"
                                >
                                    {note.title}
                                </button>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleFavorite(note._id)}
                                        title={note.favorite ? "Unpin" : "Pin as favorite"}
                                        className={`text-lg ${note.favorite ? "text-yellow-500" : "text-gray-300"} hover:text-yellow-500`}
                                    >
                                        ★
                                    </button>
                                    <button
                                        onClick={() => startEdit(note)}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => askDeleteNote(note._id)}
                                        className="text-sm text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {openId === note._id && (
                                <div className="px-4 pb-4 border-t border-border-custom">
                                    {editingId === note._id ? (
                                        <div className="space-y-3 mt-3">
                                            <input
                                                type="text"
                                                name="title"
                                                value={editForm.title}
                                                onChange={handleEditChange}
                                                className="w-full border border-border-custom rounded px-3 py-2"
                                                placeholder="Title"
                                            />
                                            <textarea
                                                name="description"
                                                value={editForm.description}
                                                onChange={handleEditChange}
                                                rows="4"
                                                className="w-full border border-border-custom rounded px-3 py-2 resize-none"
                                                placeholder="Description"
                                            />
                                            <input
                                                type="text"
                                                name="tag"
                                                value={editForm.tag}
                                                onChange={handleEditChange}
                                                className="w-full border border-border-custom rounded px-3 py-2"
                                                placeholder="Tag"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => saveEdit(note._id)}
                                                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-gray-200 px-4 py-2 rounded text-text-main"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-text-secondary mt-3 whitespace-pre-wrap">
                                            {note.description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
