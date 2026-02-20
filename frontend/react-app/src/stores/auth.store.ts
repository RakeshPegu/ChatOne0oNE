import { create } from "zustand"
import apiRequest from "../lib/apiRequest"
import Swal from 'sweetalert2'
import axios from "axios"
interface User {
  _id: string
  username: string
  email: string,
  role:string,
  password:string
}

interface UserInfo {
  username: string
  email: string
  password: string
}

interface SignInInfo {
  email: string
  password: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  signUp: (data: UserInfo) => Promise<UserInfo>
  signIn: (data: SignInInfo) => Promise<User>
  logout: () => void
}


export const useAuthStore = create<AuthStore>((set)=>({
  user:null,
  isAuthenticated:false,
  signUp: async(data)=>{
    try {
       const res = await apiRequest.post('/auth/register', data)
       Swal.fire({
        title:"Created successfully",
        text:'Account created successfully',
        icon:"success",
        
       })
       return res.data
    
      
    } catch (error) {
      let err = 'Something went wrong'
      if(axios.isAxiosError(error)){
        err = error?.response?.data?.message || err
      }
      Swal.fire({
        title:"Opps!",
        text:err,
        icon:"error"
        
      })

      
    }
   

  },
  signIn: async(data)=>{
    try {
        const res = await apiRequest.post('/auth/login', data)
       set({
         isAuthenticated:true,
         user:res.data.existingUser,
       })
         
    Swal.fire({
      title:"Signed In",
      text:"Logged In successfully",
      icon:'success'

    })
    return res.data.existingUser
      
    } catch (error) {
      let err = 'something went wrong'
      if(axios.isAxiosError(error)){
        err = error?.response?.data?.message || err

      }
      Swal.fire({
        title:'Opps!',
        text:err,
        icon:"error"
      })
      
    }



  },
  logout: async()=>{
    try {
      const res = await apiRequest.post('/auth/logout')
      set({
      user:null,
      isAuthenticated:false
      })
      Swal.fire({
        title:"Signed Off",
        text:"Logged out successfully",
        icon:"success"
      })
      
    } catch (error) {
      let err = 'something went wrong'
      if(axios.isAxiosError(error)){
        err = error?.response?.data?.message || err
      }
      Swal.fire({
        title:'Opps',
        text:err,
        icon:'error'
      })
      
    }

  }
  
  

}))