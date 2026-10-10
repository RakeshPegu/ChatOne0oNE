
import type React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
function Register (){
    const signUp= useAuthStore((s)=>s.signUp)

    const [userInfo, setUserInfo] = useState({username:'', email:'', password:''})
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const handleSubmitForm=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        try {
        setIsLoading(true)        
        console.log(userInfo)
        await signUp(userInfo)
        setUserInfo({username:"", email:'', password:""})
        navigate('/login')
            
        } catch (error) {
            console.log('this is the error', error)
            setError('error')
            
        }finally{
            setIsLoading(false)

        }

        }
    return(
        <div className="flex  justify-center ">
            <div className="hidden ">
                this the text section
            </div>
            <div className="flex flex-col rounded-xl bg-gray-500 mt-20 w-90 pb-3">
                <div className="flex flex-col items-center w-full gap-9">
                <h3 className="text-3xl text-center font-mono pt-4">Register Form</h3>
                <form className="flex flex-col gap-4 w-[95%] items-center  justify-center " onSubmit={handleSubmitForm}>                    
                    <input type="text" name="username" className="h-10 w-full outline-1 text-center" placeholder="enter your username" value={userInfo.username} onChange={(e)=>[setUserInfo({...userInfo, username:e.target.value})]}/>
                    <input type="email" name="email" className="outline-1 w-full text-center h-10" placeholder="enter your email adddress" value={userInfo.email} onChange={(e)=>{setUserInfo({...userInfo, email:e.target.value})}}/>
                    <input type="password" name="password" className="outline-1 w-full text-center h-10" placeholder="enter your password" value={userInfo.password} onChange={(e)=>{setUserInfo({...userInfo, password:e.target.value })}}/>
                    <button type="submit" disabled={isLoading} className=" w-full bg-amber-500 cursor-pointer rounded-3xl h-10 hover:bg-amber-300">Register</button>
                </form>
                </div>
                <div className=" flex flex-col gap-4 items-center ">
                    <p className="text-center ">Or</p>
                    <button type="button" className="cursor-pointer w-[95%] bg-gray-200 hover:bg-white h-10 rounded-2xl"> Sign Up with google</button>
                    <p>Have an account ? <Link to={'/login'} className="text-blue-800 hover:underline" > Sign In</Link></p>
                </div>
            </div>
        </div>
    )
}
export default Register;