import { chatModel } from "../lib/db.js"
import AppError from "../utility/error.js"

export const createChat = async(req, res)=>{
    const recieverId = req.params.userId
    const tokenUserId = req.userId 
    if(!tokenUserId){
        throw new AppError(403, 'Authentication is required')
    }
    const existingChat = await chatModel.findOne({userIDs:{$in:[tokenUserId, recieverId]}})
    if(existingChat){
        throw new AppError(400, 'Chat already exist')
    }
    const newChat = new chatModel({userIDs:[tokenUserId, recieverId]}).save()
    res.status(201).json({success:true, message:"new chat has been created successfully", newChat})
    
}
export const getChats = async(req, res)=>{
    const tokenUserId = req.userId 
    if(!tokenUserId){
        throw new AppError(403, 'Authentication is required')
    }
    const exinstingChats = await chatModel.find({userIDs:{$in:[tokenUserId]}})
    if(exinstingChats.length ===0 ){
        throw new AppError(404, 'Chats not found')
    }
    res.status(200).json({success:true, exinstingChats})
}
export const getAnyPrtclrChat = async(req, res)=>{
    const userId = req.params.userId
    const tokenUserId = req.userId
    if(!tokenUserId){
        throw new AppError(403, 'Not authenticated')
    }
    if(!userId){
        throw new AppError(400, 'Chat id is required')
    }
    const existingChat = await chatModel.findOne({userIDs:{$in:[tokenUserId, userId]}})
    if(!existingChat){
        throw new AppError(404, 'Not found')
    }
    res.status(200).json({success:true, existingChat})
}
export const deleteChat = async(req, res)=>{
    const tokenUserId = req.userId
    const chatId = req.params.chatId
    if(!tokenUserId){
        throw new AppError(403, 'Not authenticated')
    }
    if(!chatId){
        throw new AppError(400, 'Chat id is required'  )
    }
    const existingChat = await chatModel.findOne({_id:chatId, userIDs:{$in:[tokenUserId]}})
    if(!existingChat){
        throw new AppError(404, 'Chat not found' )
    }
    await chatModel.findOneAndDelete({_id:chatId , userIDs:{$in:[tokenUserId]}})
    res.status(200).json({success:false, message:'Chat has been deleted successfully'})
    
}
