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
        return {chat:chat}
        
    } catch (error) {
        console.log('this is message error', error)
        throw new Response("Failed to load messages", { status: 500 });

                
    }
}