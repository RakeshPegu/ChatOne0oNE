import { Link, useLoaderData, useNavigate } from "react-router-dom";
import apiRequest from "../lib/apiRequest";
import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";
function UserProfile(){
    const userInfo = useLoaderData() as {_id:string, username:string}
    const navigate = useNavigate()
    const [err, setErr] = useState<string|null>(null)
    const handleMessageBtnClick = async()=>{
        try {
            const res = await apiRequest.post(`/chats/${userInfo._id}`)
            if(res?.status === 201){
               navigate(`/message/${userInfo._id}/chat`)
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                if(error?.response?.status === 400){
                    navigate(`/message/${userInfo._id}/chat`)                   
                }else{

                    setErr(error?.response?.data?.message || "Something went wrong")
                    Swal.fire({
                        title:"Opps!",
                        text:error?.response?.data?.message,
                        icon: 'error'
                    })

                }
            }
            
        }
        

    }
    return(
        <div className="bg-blue-300 h-screen w-full">
            <div className="flex flex-row font-mono text-2xl bg-gray-500 gap-10 pl-3 items-center">
                <Link to={'/users'}><h3 className="text-5xl cursor-pointer">←</h3></Link>
                 <h3>{userInfo.username}</h3>
            </div>
           
            <div className="flex pt-7 items-center justify-evenly">
            <div className="flex-1 flex items-center justify-center">
                <img src="../profile.png" alt="default profile picture" className="w-20 h-20 rounded-full"/>
            </div>
            <div className="flex flex-2  gap-7">
                <div>
                    <p> 12</p>
                    <p> posts</p>
                </div>
                <div>
                    <p>124 </p>
                    <p>followers</p>
                </div>
                <div>
                    <p>10</p>
                    <p> followings</p>
                </div>
            </div>
            </div>
            <div className="flex flex-col gap-10 mt-5 items-center">
                <div className=" flex flex-col gap-3 w-[95%] ">
                <p className="text-2xl"> {userInfo.username}|| Freelancer</p>
                
                <div className="font-mono"><p>I helped many  people to find best product for their market</p></div>
                </div>
                
                <div className="flex flex-row justify-evenly w-full">
                    <button className="cursor-pointer bg-amber-400 rounded-2xl w-40 h-10"> Follow</button>
                    <button className="cursor-pointer bg-amber-400 rounded-2xl w-40 h-10" onClick={handleMessageBtnClick} >message </button>
                </div>
            </div>
        </div>
    )
}
export default UserProfile;