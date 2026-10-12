import mongoose, { mongo } from 'mongoose'
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },

    role:{
        type:String,
        required:true,
        default:'user'

    },
    password:{
        type:String,
        required:true
    }
}, {timestamps:true})
export const userModel = mongoose.model('User', userSchema)
const chatSchema = new mongoose.Schema({
    userIDs:[{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'User'
    },],
    isGroupChat:{
        type:Boolean,
        default:false
    }


}, {timestamps:true})
export const chatModel = mongoose.model('Chat', chatSchema)
const messageSchema = new mongoose.Schema({
    chatId:{type:mongoose.Schema.ObjectId, required:true, ref:'Chat'},
    recieverId:{type:mongoose.Schema.ObjectId, ref:'User'},
    senderId:{type:mongoose.Schema.ObjectId, required:true, ref:'User'},
    text:{type:String, required:true},
    seenBy:{
        type:[mongoose.Schema.ObjectId],
        default:[]
        
        
    }
}, {timestamps:true})
messageSchema.index({createdAt:-1})
export const messageModel = mongoose.model('Message', messageSchema)