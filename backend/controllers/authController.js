import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";

const registerUser=asyncHandler(async(req,res)=>{
    const{name,email,password,role}=req.body;
    if (!name || !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}

    const existingUser= await User.findOne({email})
    if(existingUser) return res.status(409).json({message:"User already exist"})
    const hashpassword= await bcrypt.hash(password,10);
const user= new User(
{
    name,email,password:hashpassword,role:role||'student'
})
await user.save()
const token=jwt.sign(
        {userId:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    )
 res.status(200).json({
        message:"User registered successufully",
        token,
        userInfo:{
            id:user._id,
            name: user.name,
            role: user.role,
            email: user.email
        }
    })


})

const loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    if ( !email || !password) {
  return res.status(400).json({ message: "All fields are required" });
}

    const user= await User.findOne({email})
    if(!user) return res.status(401).json({
        message:"Invalid Email"
    })
    const matchPass= await bcrypt.compare(password,user.password)
    if(!matchPass) return res.status(400).json({
        message:"Invalid password"
    })
    const token=jwt.sign(
        {userId:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    )

    res.status(200).json({
        message:"User login successufully",
        token,
        userInfo:{
            id:user._id,
            name: user.name,
            role: user.role,
            email: user.email
        }
    })
})
export{registerUser,loginUser}