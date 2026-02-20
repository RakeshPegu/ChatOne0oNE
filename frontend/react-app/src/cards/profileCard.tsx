interface UserInfo{
    username:string,
    _id:string

}
function ProfileCard({userInfo}:{userInfo:UserInfo}){
    return(       
        <div className="flex  bg-green-300 w-full cursor-pointer rounded-2xl p-2">     
            <div className=" flex flex-1 justify-center items-center "><img src="profile.png" alt="profile picture" className="w-10 h-10 rounded-full"/></div>
            <div className="flex flex-3 flex-col  items-center justify-center ">
                <h3 className="font-mono text-xl"> {userInfo.username}</h3>
                <p> Hello world this is me rakesh pegu</p>
            </div>                    
        </div>
        
    )
}
export default ProfileCard;