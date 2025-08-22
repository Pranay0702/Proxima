import User from '../model/user.model.js';

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
    if(!user){
      return res.status(400).json({message: "User not found"});
    }
    return res.status(200).json({user});
  }catch (e){
    console.error(e);
    return res.status(500).json({message: "Internal server error"});
  }
}

export async function updateUser (req,res){
  try{
    const userId = req.user.id;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updates,{
      new: true, //returns the updated data
      runValidators: true,
    });

    if (!updateUser){
      return res.status(400).json({message: "User not found"});
    }
    res.json(updatedUser);
  }catch (e){
    return res.status(500).json({message: "Internal server error"});
  }
}

