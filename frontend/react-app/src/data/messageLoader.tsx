import type { LoaderFunctionArgs } from "react-router-dom"
import apiRequest from "../lib/apiRequest"
export const messageLoader = async({params}:LoaderFunctionArgs)=>{
    if(!params.userId){
        throw new  Response('User Id is missing', {status:400})
    }
    const {userId} = params
    try {
        const chatInfo = await apiRequest.get(`/chats/${userId}`)
        const res = await apiRequest.get(`/messages/get_all_messages/${chatInfo?.data.existingChat?._id}`)
        return {chat:chatInfo.data.existingChat,messages:res.data?.messages ?? []}
        
    } catch (error) {
        console.log(error)
        throw new Response("Failed to load messages", { status: 500 });

                
    }
}