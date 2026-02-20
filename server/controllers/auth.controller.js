import { userModel } from "../lib/db.js"
import AppError from "../utility/error.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async(req, res)=>{
    const {email, username, password} = req.body
    console.log(req.body)
    if(!email || !username || !password){
        throw new AppError(400, 'all the fields are mandatory')
    }
    const existingUser = await userModel.findOne({email:email})
    if(existingUser){
       throw new AppError(400, 'email address already exist'  )
    }
    const hashedPass = await bcrypt.hash(password, 10)
    new userModel({username, email, password:hashedPass}).save()
    res.status(201).json({success:true, message:'Registered user successfully'  })

    
    
}
export const login = async(req, res)=>{
    const {email, password} = req.body
    if(!email ||!password){
        throw new AppError(400, 'All the fields are mandatory'  )
    }
    const existingUser = await userModel.findOne({email:email})
    if(!existingUser){
        throw new AppError(404, 'Not found')
    }
    const IsValidPass = await bcrypt.compare(password, existingUser.password)
    if(!IsValidPass){
        throw new AppError(401, 'Wrong password')
    }
    const maxAge = 1000*60*60*24*7
    const token = jwt.sign({id:existingUser._id, role:existingUser.role},process.env.JWT_SECRET_KEY,{expiresIn:maxAge})
    res.cookie('token', token, {httpOnly:true, secure:false, maxAge:maxAge})
    res.status(200).json({message:"Logged In successfully", existingUser})


}
export const logout = async(req, res)=>{
    const tokenUserId =req.userId 
    if(!tokenUserId){
        throw new AppError(402, 'Authentication is required')
    }
    res.clearCookie('token').status(200).json({success:true, message:"logged out successfully"})

}