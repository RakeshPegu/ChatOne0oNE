import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/auth.store";
import apiRequest from "../lib/apiRequest";

interface ChatInfo{
    _id:string,
    userIDs: string[],

}
interface RecieverInfo {
    _id:string,
    username:string
}

function ChatCard({chatInfo}:{chatInfo:ChatInfo}){
    const [recieverInfo, setRecieverInfo] = useState <RecieverInfo>()
    const userInfo = useAuthStore((s)=>s.user)

    useEffect(() => {
  if (!userInfo) return;

    const receiverId = chatInfo.userIDs.find(
    (id) => id.toString() !== userInfo._id.toString()
    );

  console.log("receiverId:", receiverId);
  const fetchUserInfo = async ()=>{
    const res = await apiRequest.get(`/users/${receiverId || userInfo._id }`)
    setRecieverInfo(res.data)

  }
  fetchUserInfo()

}, [chatInfo, userInfo]);
   return(

        <div className="flex justify-evenly bg-blue-200 rounded-xl cursor-pointer">
            <div className="flex justify-center items-center"> <img src="../profile.png" alt="user profile pic" className="w-10 h-10 rounded-full"/></div>
            <div> 
                <div><h3 className="text-xl">{recieverInfo?.username}</h3>  </div>
                <div> hey ki khbr?? vat khala ne ? kot asa?</div>
            </div>
            <div className="flex items-center justify-center flex-col gap-1">
                <p className="bg-blue-500 rounded-full flex w-6 text-sm  items-center justify-center"> 10</p>
                <p className="text-sm">2/1/2026</p>
            </div>
        </div>
    )
}
export default ChatCard;