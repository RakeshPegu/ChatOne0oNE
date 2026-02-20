import { useState, type FormEvent } from "react";
import ProfileCard from "../cards/profileCard";
import { Link, useLoaderData } from "react-router-dom";
interface UserInfo{
    username:string,
    _id:string,
    
}
function UserList(){
    const userInfo = useLoaderData() as UserInfo[]
    const [username, setUsername] = useState({username:''})
    const handleSubmitForm = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        console.log(username)
        setUsername({username:''})

    }
    return(
        <div>
            <div className="w-full bg-gray-500 h-15 flex items-center justify-center fixed">
                <form onSubmit={handleSubmitForm} className="flex flex-colbg-blue-200 w-[95%] h-10 outline-0 gap-1 rounded-2xl outline-black ">
                    <input type="text" value={username.username} maxLength={25} placeholder="search by username" onChange={(e)=>{setUsername({username:e.target.value})}} className="bg-amber-400  focus:outline-none text-center flex-3"/>
                    <button type="submit" className="flex-1 rounded-2xl bg-blue-500"> search</button>
                </form>

            </div>
            <div className="pt-10">
                <ul className="flex flex-col gap-5 w-full bg-amber-300 h-screen overflow-y-scroll pt-10">
                {userInfo && userInfo.map((info:UserInfo)=><li key={info._id} className="flex justify-center items-center w-full"><Link to={`/profile/${info._id}`} className="w-[95%]"><ProfileCard userInfo={info}/></Link></li>)}
                </ul> 
            </div>
        </div>
    )
}
export default UserList;