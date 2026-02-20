import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";

function Login(){
    const signIn = useAuthStore((s)=>s.signIn)
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState({password:'', email:''})
    const handleSubmitForm =async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        const res = await signIn(userInfo)
        if(res){                   
            navigate(`/chats/${res._id}`)
        }
        setUserInfo({password:'', email:''})
    }
    
    return(
        <div>
          <div className="flex  justify-center ">
            <div className="hidden ">
                this the text section
            </div>
            <div className="flex flex-col rounded-xl bg-gray-500 mt-20 w-90 pb-3">
                <div className="flex flex-col items-center w-full gap-9">
                <h3 className="text-3xl text-center font-mono pt-8 ">Login Form</h3>
                <form className="flex flex-col gap-4 w-[95%] items-center  justify-center " onSubmit={handleSubmitForm}>                    
                     <input type="email" name="email" className="outline-1 w-full text-center h-10" placeholder="enter your email adddress" value={userInfo.email}  onChange={(e)=>{setUserInfo({...userInfo, email:e.target.value})}}/>
                    <input type="password" name="password" className="outline-1 w-full text-center h-10" placeholder="enter your password" value={userInfo.password} onChange={(e)=>{setUserInfo({...userInfo, password:e.target.value})}}/>
                    <button type="submit" className=" w-full bg-amber-500 cursor-pointer rounded-3xl h-10 hover:bg-amber-300">Sign In</button>
                </form>
                </div>
                <div className=" flex flex-col gap-4 items-center pt-3">
                    <p className="text-center ">Or</p>
                    <button type="button" className="cursor-pointer w-[95%] bg-gray-200 hover:bg-white h-10 rounded-2xl"> Sign In with google</button>
                    <p>Don't have an account ? <Link to={'/'} className="text-blue-800 hover:underline"> Sign Up</Link></p>
                </div>
            </div>
        </div>
        </div>
    )
}
export default Login;