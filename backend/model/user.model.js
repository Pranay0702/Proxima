import mongoose from "mongoose";

const experienceSchema= new mongoose.Schema({
    id:{type:String, required:true},
    title:{type:String, required:true},
    company:{type:String, required:true},
    duration:{type:String, required:true},
    description:{type:String, required:false},
},{_id: false});

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    location: {type: String, required: false},
    jobTitle: {type: String, required: false},
    company: {type: String, required: false},
    description: {type: String, required: false},
    phone: {type: String, required: false},
    profileImage:{type: String, required: false},
    skills:[{type:String}],
    experience:[experienceSchema],
    password: {type: String, required: true},
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;