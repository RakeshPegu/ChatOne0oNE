import { type LoaderFunctionArgs } from "react-router-dom";
import apiRequest from "../lib/apiRequest";
export const getUsersInfoLoader= async()=>{
    const res = await apiRequest.get('/users')
    return res.data.frnsInfo
}
export const userLoader = async({params}:LoaderFunctionArgs)=>{
    const {userId} = params
    const res = await apiRequest.get(`/users/${userId}`)
    return res.data
}
