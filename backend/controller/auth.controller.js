import User from "../model/user.model.js";
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

export async function register(req, res){
    try{
        const{username, email, password, location, jobTitle, description} = req.body;
        const userExists = await User.findOne({username});
        if (userExists) return res.status(400).json({message: "Username already taken"});

        const emailExists = await User.findOne({email});
        if (emailExists) return res.status(400).json({message: "email already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({username, email, password: hashedPassword, location, jobTitle, description});
        await user.save();

        res.status(201).json({message: "User successfully registerd"});
    } catch(e){
        console.error(e);
        res.status(500).json(e);
    }
}

export async function login(req, res){
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if (!user) return res.status(400).json({message: "Invalid username"});

        const  isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid password"});

        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({message: "Login successful", token, user: {id: user._id, username: user.username, email: user.email}});
    } catch(e){
        console.error(e);

        return res.status(500).json(e);
    }
}
