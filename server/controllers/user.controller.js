import User from "../models/user.model.js";

export const getUserData = async(req, res) => {
    try {
        
        const {userId} = req.body;

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({ message: "User does not exist" });
        }

        res.json({message: "User data fetched successfully", userData: {
            name: user.name,
            isAccountVerified: user.isAccountVerified
        }});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}