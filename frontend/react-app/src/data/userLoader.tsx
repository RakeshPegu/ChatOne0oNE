import type { LoaderFunctionArgs } from "react-router-dom"
import apiRequest from "../lib/apiRequest"

export const userLoader = async({params}:LoaderFunctionArgs)=>{
    const {userId} = params
    try {
       const user = await apiRequest.get(`/users/${userId}`)
       return user.data
        
    } catch (error) {
        throw new Response("Failed to load messages", { status: 500 })
        
    }

}