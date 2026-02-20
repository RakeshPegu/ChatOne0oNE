import { Link, useLoaderData } from "react-router-dom"
import ChatCard from "../cards/ChatCard"
interface ChatInfo{
    _id:string,
    userIDs: string[],

}
function Home(){
    const chatsInfo = useLoaderData()

    return(
        <div className="flex flex-col"> 
            <div className="h-15 flex justify-center items-center  fixed w-full">
                <form className="w-[85%] outline-1 cursor-pointer  h-9 flex justify-around rounded-2xl">
                    <input type="text" className=" outline-none pl-5  w-[80%]" maxLength={40} name="search" placeholder="search your friends"/>
                    <button className="">search</button>
                </form>
            </div>
            <div className="flex flex-col w-full h-[90vh] bg-amber-600 mt-20  pb-20">
                <ul className="flex flex-col items-center w-full mt-10 gap-5 ">
                {chatsInfo && chatsInfo.map((chatInfo: ChatInfo)=><li key={chatInfo._id}  className="w-[96%]"><ChatCard chatInfo={chatInfo}/></li>)}
                </ul>
                <div className="w-10 h-10 fixed bottom-10 right-10  rounded-xl  cursor-pointer flex justify-center items-center text-4xl bg-gray-800 "><Link to={'/users'}>+</Link></div>
                
                
            </div>
        </div>
        
    )
}
export default Home