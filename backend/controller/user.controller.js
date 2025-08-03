import User from '../model/user.model.js';

export async function getUserList(req, res) {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i'); // Case-insensitive regex

    const users = await User.find({
        $or: [
            { username: regex },
            { email: regex },
            {location: regex},
            {jobTitle: regex}
        ]
    },{password: 0, __v: 0}); // Exclude password and __v field
    return res.status(200).json({users});
  }
  catch (e) {
    console.error(e);
    return res.status(500).json({message: "Internal server error"});
  }    

}