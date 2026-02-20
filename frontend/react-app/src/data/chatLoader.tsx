import apiRequest from "../lib/apiRequest";

export const  ChatLoader = async()=>{
    try {
        const res = await apiRequest.get(`/chats`)
        return res.data.exinstingChats
        
    } catch (error) {
        throw new Response('Failed to load chats', {status:500})
        
    }

}