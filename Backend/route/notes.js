import express from "express";
import { Notes, Subject } from "../models/notes.js";
import User from "../models/user.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();
router.use(express.json());

// logged-in user's profile + stats (for the dashboard page)
router.get("/me", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" });
        }
        const subjectCount = await Subject.countDocuments({ user: userId });
        const noteCount = await Notes.countDocuments({ user: userId });
        const favoriteCount = await Notes.countDocuments({ user: userId, favorite: true });

        return res.status(200).json({
            success: true,
            user,
            stats: { subjectCount, noteCount, favoriteCount }
        });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// fetch all subjects, with note counts
router.get("/getNotes", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const subjects = await Subject.find({ user: userId }).lean();

        const subjectsWithCount = await Promise.all(
            subjects.map(async (sub) => {
                const noteCount = await Notes.countDocuments({ subject: sub._id });
                return { ...sub, noteCount };
            })
        );

        return res.status(200).json({
            success: true,
            message: subjectsWithCount.length === 0 ? "there is no notes currently" : "notes are fetched",
            subject: subjectsWithCount
        });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// get notes for one subject
// optional query param ?sort=oldest to reverse the default newest-first order
router.get("/getNotes/:id", fetchUser, async (req, res) => {
    try {
        const Id = req.params.id;
        const sortOrder = req.query.sort === "oldest" ? 1 : -1;
        const sub = await Subject.findById(Id);
        const notes = await Notes.find({ subject: Id })
            .sort({ favorite: -1, createdAt: sortOrder });
        return res.status(200).json({
            success: true,
            message: notes.length === 0 ? "no content available" : "this is the content",
            notes,
            sub
        });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// create a subject + first note
router.post("/createNotes", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const { subject, tag, description, title } = req.body;
        const sub = await Subject.create({ subject, user: userId });
        const note = await Notes.create({
            tag, title, description,
            user: userId,
            subject: sub._id
        });
        return res.status(201).json({ success: true, message: "note created successfully", sub, note });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// add a note to an existing subject
router.post("/addNote/:subjectId", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const subjectId = req.params.subjectId;
        const { title, tag, description } = req.body;
        const note = await Notes.create({
            title, tag, description,
            user: userId,
            subject: subjectId
        });
        return res.status(201).json({ success: true, message: "note added successfully", note });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// edit a note
router.post("/updateNotes/:id", fetchUser, async (req, res) => {
    try {
        const Id = req.params.id;
        const { title, tag, description } = req.body;
        const note = await Notes.findByIdAndUpdate(
            Id,
            { $set: { title, description, tag } },
            { new: true }
        );
        if (!note) {
            return res.status(404).json({ success: false, message: "note not found" });
        }
        return res.status(200).json({ success: true, message: "data is updated successfully", note });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// toggle favorite/pin on a note
router.post("/toggleFavorite/:id", fetchUser, async (req, res) => {
    try {
        const Id = req.params.id;
        const note = await Notes.findById(Id);
        if (!note) {
            return res.status(404).json({ success: false, message: "note not found" });
        }
        note.favorite = !note.favorite;
        await note.save();
        return res.status(200).json({ success: true, message: "favorite toggled", note });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// rename a subject
router.post("/updateSubject/:id", fetchUser, async (req, res) => {
    try {
        const Id = req.params.id;
        const { subject } = req.body;
        const sub = await Subject.findByIdAndUpdate(
            Id,
            { $set: { subject } },
            { new: true }
        );
        if (!sub) {
            return res.status(404).json({ success: false, message: "subject not found" });
        }
        return res.status(200).json({ success: true, message: "subject updated successfully", sub });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// delete a note
router.delete("/deleteNotes/:id", fetchUser, async (req, res) => {
    try {
        const Id = req.params.id;
        const note = await Notes.findByIdAndDelete(Id);
        if (!note) {
            return res.status(404).json({ success: false, message: "note not found!!" });
        }
        return res.status(200).json({ success: true, message: "note deleted successfully", note });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// delete a subject and all its notes
router.delete("/deleteSubject/:id", fetchUser, async (req, res) => {
    try {
        const Id = req.params.id;
        const sub = await Subject.findByIdAndDelete(Id);
        if (!sub) {
            return res.status(404).json({ success: false, message: "subject not found" });
        }
        await Notes.deleteMany({ subject: Id });
        return res.status(200).json({ success: true, message: "subject and its notes deleted", sub });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
// guest data
router.delete("/guest-cleanup", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (!user || !user.isGuest) {
            return res.status(403).json({ success: false, message: "not a guest session" });
        }

        await Notes.deleteMany({ user: userId });
        await Subject.deleteMany({ user: userId });
        await User.findByIdAndDelete(userId);

        return res.status(200).json({ success: true, message: "guest session data cleared" });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

export default router;
