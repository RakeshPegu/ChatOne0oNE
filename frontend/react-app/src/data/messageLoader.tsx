import type { LoaderFunctionArgs } from "react-router-dom"
import apiRequest from "../lib/apiRequest"

interface Chat {
    existingChat:{
    _id:string ;
    username:string ;
    userIDs: string[];
    isGroup: boolean;
    };
    username:string

}

export const messageLoader = async({params}:LoaderFunctionArgs)=>{
    const {userId} = params
    try {
        const existingChat = await apiRequest.get(`/chats/get_particular_chat/${userId}`)  
        if(!existingChat){
            return
        }
        const chat = existingChat.data.receiverData as Chat
        const res = await apiRequest.get(`/messages/get_all_messages/${chat.existingChat._id}`)
    
        const messages = Array.isArray(res.data)   
        ? res.data
        : res.data.messages ?? []                      
        return {chat:chat, messages:messages}
        
    } catch (error) {
        console.log(error)
        throw new Response("Failed to load messages", { status: 500 });

                
    }
}