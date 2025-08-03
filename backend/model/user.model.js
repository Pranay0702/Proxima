import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    location: {type: String, required: false},
    jobTitle: {type: String, required: false},
    description: {type: String, required: false},
    password: {type: String, required: true},
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;