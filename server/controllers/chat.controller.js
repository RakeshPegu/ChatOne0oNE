import { chatModel, userModel } from "../lib/db.js"
import AppError from "../utility/error.js"

export const createChat = async(req, res)=>{
    const recieverId = req.params.userId
    const tokenUserId = req.userId 
    if(!tokenUserId){
        throw new AppError(403, 'Authentication is required')
    }
    if (tokenUserId.toString() === recieverId.toString()) {
    return res.status(400).json({
        success: false,
        message: "You cannot start a chat with yourself",
    });
    }
    const existingChat = await chatModel.findOne({userIDs:{$in:[tokenUserId, recieverId]}})
    let newChat = existingChat
    
    if(!existingChat){
        const newChat = await chatModel.create({userIDs:[tokenUserId, recieverId]})
        newChat = newChat
    }

    res.status(201).json({success:true, message:"new chat has been created successfully", newChat})
    
}
export const getChats = async(req, res)=>{
    try {
        const tokenUserId = req.userId
        if(!tokenUserId){
        throw new AppError(403, 'Authentication is required')
      }

      const existingChats = await chatModel.find({userIDs:{$in:[tokenUserId]}})
      res.status(200).json({success:true, existingChats})
    } catch (error) {
        res.status(500).json({success:false, message:error || 'Something went wrong'})
        
    }
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
    let existingChat = await chatModel.findOne({userIDs:{$in:[tokenUserId, userId]}})
    if(!existingChat){
        throw new AppError(404, 'Not found')
    }
    const user = await userModel.findById(userId).lean();

    if (!user) {
    return res.status(404).json({
        success: false,
        message: "User not found",
    });
    }

    const { username, ...receiverInfo } = user
        return res.status(200).json({
        success: true,
        receiverData: {
            existingChat,
            username,
        },
        });
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
