interface Messages{
    _id:string,
    text: string,

}
function MessageCard({messages}:{messages: Messages}){
    return(
        <div className="bg-gray-600 text-white  max-w-50 ml-5 mt-3 rounded-2xl text-center w cursor-pointer ">
            {messages.text}
        </div>
    )
}  
export default MessageCard;