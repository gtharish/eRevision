import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
router.use(express.json());

const round = 10;

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "user already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, round);
        const newUser = await User.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ user: { id: newUser._id } }, process.env.JWT_SECRET);

        return res.status(201).json({
            success: true,
            message: "user signup successfully",
            authToken: token,
            newUser
        });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "credentials failed" });
        }
        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.status(401).json({ success: false, message: "incorrect password" });
        }
        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: "user logged in",
            authToken: token
        });
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ success: false, message: "internal server error" });
    }
});

export default router;
