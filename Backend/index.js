import "dotenv/config";
import express from "express";
import cors from "cors";
import Connect from "./db.js";
import notesRouter from "./route/notes.js";
import authRouter from "./route/auth.js";

const app = express();
app.use(cors());
app.use(express.json());

const Port = 8000;

const Start = async () => {
    await Connect();
};
Start();

app.get("/", (req, res) => {
    res.send("<h1>eRevision API is running</h1>");
});

app.use("/eRevision", authRouter);
app.use("/eRevision", notesRouter);

app.listen(Port, () => {
    console.log(`Server listening on port ${Port}`);
});
