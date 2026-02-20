import { chatModel, messageModel } from "../lib/db.js"
import AppError from "../utility/error.js"

export const sendMessage = async(req, res)=>{
    const chatId = req.params.chatId
    const tokenUserId =req.userId
    const {text} = req.body
    console.log(text)
    if(!chatId){
        throw new AppError(400, 'chat id is required')
    }
    if(!text){
        throw new AppError(400, 'Text is required')    }
    const existingChat = await chatModel.findOne({_id:chatId, userIDs:{$in:[tokenUserId]}})
    if(!existingChat){
        throw new AppError(404, 'Chat not found')
    }
    const newMessage = await new messageModel({text, chatId:chatId, senderId:tokenUserId}).save()
    const io = req.app.get('io')
    console.log(io)
    io.to(req.params.chatId).emit("recieve-msg", {
        _id:Date.now().toString(),
        chatId:newMessage.chatId,
        text:newMessage.text

    })

    res.status(201).json({success:true, message:"Sent a message successfully", newMessage})

}
export const getMessages = async(req, res)=>{
    const tokenUserId = req.userId
    const chatId = req.params.chatId
    if(!tokenUserId){
        throw new AppError(403, 'Not authenticated')
    }
    if(!chatId){
        throw new AppError(400, 'Chat id is required')
    }
    const existingChat = await chatModel.findOne({_id:chatId, userIDs:{$in:[tokenUserId]}})
    if(!existingChat){
        throw new AppError(404, 'Chat not found')
    }
    const messages = await messageModel.find({chatId:chatId})     
    res.status(200).json({success:true, messages})

}
export const readMessage = async(req, res)=>{
    const tokenUserId = req.userId
    const chatId = req.params.chatId
    if(!tokenUserId){
        throw new AppError(403, 'Not authenticated')
    }
    if(!chatId){
        throw new AppError(403, 'chat Id is required' )
    }
    const existingChat = await chatModel.findOne({_id:chatId, userIDs:{$in:[tokenUserId]}})
    if(!existingChat){
        throw new AppError(404, 'Chat not found')
    }
    const messages = await messageModel.find({chatId:chatId, seenBy:{$ne:tokenUserId}})
    console.log(messages)
    if(messages.length ===0){
        throw new AppError(404, 'messages not found')
    }
    const updateMesages = await messageModel.updateMany({chatId:chatId, seenBy:{$ne:tokenUserId}}, {$addToSet:{seenBy:tokenUserId}}, {new:true })  
    res.status(200).json({success:true, message:"updated successfully"})
}
export const deleteMessage = async(req, res)=>{
    const tokenUserId = req.userId 
    const messageId = req.params.messageId
    if(!tokenUserId){
        throw new AppError(403, 'Not authenticated')
    }
    const exinstingMessage = await messageModel.findOne({_id:messageId})
    if(!exinstingMessage){
        throw new AppError(404, 'Message not found')
    }
    await messageModel.findOneAndDelete({_id:messageId})
    res.status(200).json({success:true, message:'message has been deleted successfully'})
}
export const updateMessage = async(req, res)=>{
    const tokenUserId = req.userId 
    const messageId = req.params.messageId
    const {text} = req.body
    if(!tokenUserId){
        throw new AppError(403, 'Not authenticated')
    }
    const existingMessage = await messageModel.findOne({_id:messageId})
    if(!existingMessage){
        throw new AppError(404, 'message not found')
    }
    const newUpdatedMessage = await messageModel.findOneAndUpdate({_id:messageId}, {$set:{text:text}}, {new:true})
    res.status(201).json({success:true, message:"updated message successfully", newUpdatedMessage})
}