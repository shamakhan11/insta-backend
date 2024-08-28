import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils.js/datauri.js";
import cloudinary from "../utils.js/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(404).json({
                message: "something is missing, please check once!",
                success: false,
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "Congratulations Account created!!",
            success: true,
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "something is missing, please check once!",
                success: false,
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password!!",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect password!!",
                success: false,
            })
        }

        user = {
            _id: user_id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
        }

        const token = await jwt.sign({ userId: user_id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'logged out successfully',
            success: true,
        })
    } catch (error) {
        console.log(error)
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId);
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.body;

        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }
        if(bio) user.bio = bio;
        if(gender) user.gender =  gender; 
        if(profilePicture) user.profilePicture = cloudResponse.secure_url; 
        await user.save();
        
        return res.status(201).json({
            message: "update successfull",
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
    }
}

export const getSuggestedUsers = async (req,res) => {
    try {
        const suggestedUser = await User.find({_id:{$ne:req.id}}).select("-password")
        if(!suggestedUser){
        return req.status(400).json({
            message : "currently do not have any user"
        })
    };
    return req.status(200).json({
        success : true,
        user : suggestedUser
    }) 
    } catch (error) {
        console.log(error)
    }
}

export const followOrUnfollow = async (req,res) => {
    try {
        const followUser = req.id;
        const followingUser = req.params.id;
        if(followUser === followingUser){
            return res.status(400),josn({
                message : "you can not follow / unfollow yourself",
                success : false
            })
        }

        const user = await User.findById(followUser)
        const targetUSer = await User.findById(followingUser)
        if(!user !== targetUSer){
            return res.status(400),josn({
                message : "user not found",
                success : false
            })
        }

        const isFollowing = user.following.includes(followingUser)
        if(isFollowing){
            await Promise.all([
                User.updateOne({_id:followUser},{$pull:{following:followingUser}}),
                User.updateOne({_id:followingUser},{$pull:{following:followUser}}),
            ])
            return res.status(200).json({message : "unfollowed successfully", status : true})
        }else {
            await Promise.all([
                User.updateOne({_id:followUser},{$push:{following:followingUser}}),
                User.updateOne({_id:followingUser},{$push:{following:followUser}}),
            ])
            return res.status(200).json({message : "followed successfully", status : true})
        }
    } catch (error) {
        console.log(error)
    }
}