import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    Date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);
export default User;
