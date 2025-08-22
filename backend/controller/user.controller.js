import User from '../model/user.model.js';
import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to save files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

// File filter (optional: only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image file"), false);
  }
};

export const upload = multer({ storage, fileFilter });

export async function getUserList(req, res) {
  try {
    const {search = ''} = req.query;
    let query = {};

    if (search.trim() !==''){
      const regex = new RegExp(search, 'i'); //case-insensitive regex
      query.$or = [
        {username: regex},
        {email: regex},
        {location: regex},
        {jobTitle: regex},
        {company: regex}
      ];
    }

    const users = await User.find(query, {password: 0, __v:0}); //excludes the password of users and __v
    return  res.status(200).json({users});
  }catch (e){
    console.error(e);
    return res.status(500).json({message: "Internal server error"});
  }  
}

export async function getUserID(req, res){
  try{
    console.log("Decoded user from token:",req.user);
    const user = await User.findById(req.user.id, {password: 0, __v:0});
    if(!user) return res.status(400).json({message: "User not found"});

    const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
    if (user.profileImage) user.profileImage = `${serverUrl}/${user.profileImage.replace(/\\/g, "/")}`;
    if (user.coverImage) user.coverImage = `${serverUrl}/${user.coverImage.replace(/\\/g, "/")}`;
    return res.status(200).json({user});
  }catch (e){
    console.error(e);
    return res.status(500).json({message: "Internal server error"});
  }
}

export async function updateUser (req,res){
  try{
    const userId = req.user.id;
    const {username, email, location, jobTitle, company,phone,description,skills,password} = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (location) updates.location = location;
    if (jobTitle) updates.jobTitle = jobTitle;
    if (company) updates.company = company;
    if (phone) updates.phone = phone;
    if (description) updates.description = description;
    if (skills) updates.skills = JSON.parse(skills);
    if (password) updates.password = password;

    if (req.files?.profileImage) {
      updates.profileImage = req.files.profileImage[0].path;
    }
    if (req.files?.coverImage) {
      updates.coverImage = req.files.coverImage[0].path;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates,{
      new: true, 
      runValidators: true,
    }).select("-password -__v");

    if (!updatedUser){
      return res.status(400).json({message: "User not found"});
    }

    const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
    if (updatedUser.profileImage) {
      updatedUser.profileImage = `${serverUrl}/${updatedUser.profileImage.replace(/\\/g, "/")}`;
    }
    if (updatedUser.coverImage) {
      updatedUser.coverImage = `${serverUrl}/${updatedUser.coverImage.replace(/\\/g, "/")}`;
    }
    return res.status(200).json({user: updatedUser}); 
  }catch (e){
    console.error(e);
    return res.status(500).json({message: "Internal server error"});
  }
}


