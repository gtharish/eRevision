import { useState, useContext } from "react";
import NotesContext from "../context/NotesContext";
import { useNavigate } from "react-router-dom";

export default function CreateNotes() {
    const navigate = useNavigate();
    const { createNotes } = useContext(NotesContext);
    const [note, setNote] = useState({
        subject: "",
        title: "",
        tag: "",
        description: ""
    });

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!note.subject.trim() || !note.title.trim()) return;
        const data = await createNotes(note);
        if (data.success) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen bg-page flex justify-center py-10 px-4">
            <div className="w-full max-w-2xl bg-card border border-border-custom rounded-2xl shadow-sm p-8">
                <h2 className="text-3xl font-bold text-text-main mb-2">Create Subject</h2>
                <p className="text-text-secondary mb-8">Start a new subject with its first note.</p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">Subject</label>
                        <input
                            type="text"
                            placeholder="e.g. Data Structures"
                            name="subject"
                            value={note.subject}
                            onChange={handleChange}
                            className="w-full border border-border-custom rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">Title</label>
                        <input
                            type="text"
                            placeholder="Enter note title..."
                            name="title"
                            value={note.title}
                            onChange={handleChange}
                            className="w-full border border-border-custom rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">Description</label>
                        <textarea
                            rows="6"
                            placeholder="Write your notes here..."
                            name="description"
                            value={note.description}
                            onChange={handleChange}
                            className="w-full border border-border-custom rounded-lg px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-main mb-2">Tag</label>
                        <input
                            type="text"
                            placeholder="Example: React, DBMS, JavaScript..."
                            name="tag"
                            value={note.tag}
                            onChange={handleChange}
                            className="w-full border border-border-custom rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-hover transition duration-200"
                        >
                            Save Note
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
