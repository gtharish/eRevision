import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    email:{
      type: String,
      unique:true
    },
    password: String,
    Date: {
        type: Date,
        default: Date.now
    },
    isGuest: {
    type: Boolean,
    default: false
},
});

const User = mongoose.model("User", userSchema);
export default User;
