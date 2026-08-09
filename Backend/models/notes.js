import mongoose from "mongoose";
const Schema = mongoose.Schema;

const notesSchema = new Schema({
    title: String,
    tag: [String],
    description: String,
    favorite: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: "Subject"
    }
}, { timestamps: true });

const subjectSchema = new Schema({
    subject: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const Notes = mongoose.model("Notes", notesSchema);
const Subject = mongoose.model("Subject", subjectSchema);
export { Notes, Subject };
