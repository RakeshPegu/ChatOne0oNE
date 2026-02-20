import { userModel } from "../lib/db.js"
import AppError from "../utility/error.js"
import bcrypt from 'bcrypt'

export const getFriendsInfo = async(req, res)=>{
    const tokenUserId = req.userId
    if(!tokenUserId){
        throw new AppError(403, 'Authentication is required')
    }
    const frnsInfo = await userModel.find()
    if(frnsInfo.length === 0){
        throw new AppError(404, 'User not found')
    }
    res.status(200).json({success:true, frnsInfo})
}
export const getPrtcularFrnInfo = async(req, res)=>{
    const tokenUserId = req.userId
    const userId = req.params.id
    if(!tokenUserId){
        throw new AppError(403, 'Authentication is required')
    }
    if(!userId){
        throw new AppError(400, 'user id is required')
    }
    const userInfo = await userModel.findOne({_id:userId})
    if(!userInfo){
        throw new AppError(404, 'Not found')
    }
    const {username,_id, ...otherInfo} = userInfo
    res.status(200).json({success:true, _id, username})

}
export const deleteUser = async(req, res)=>{
    const tokenUserId = req.userId 
    const {password} = req.body
    if(!tokenUserId){
        throw new AppError(403, 'Not authenticated')
    }
    const existingUser = await userModel.findById(tokenUserId)
    if(!existingUser){
        throw new AppError(404, 'User not found')
   }
   const IsValidPass = await bcrypt.compare(password, existingUser.password)
   if(!IsValidPass){
        throw new AppError(401, 'Not allowed')
   }
   await userModel.findOneAndDelete({_id:tokenUserId})
   res.status(200).json({success:true, message:"Delete account successfully"})

}
export const updateUser = async(req, res)=>{
    const tokenUserId = req.userId
    const {...updatedInfo} = req.body
    if(!tokenUserId){
        throw new AppError(403, 'Not authenticated')
    }
    const existingUser = await userModel.findById(tokenUserId)
    if(!existingUser){
        throw new AppError(404, 'User not found')
    }
    const userNewInfo = await userModel.findOneAndUpdate({_id:tokenUserId}, {$set:{...updatedInfo}}, {new:true})
    res.status(201).json({success:true, message:"Updated user successfully", userNewInfo})

}