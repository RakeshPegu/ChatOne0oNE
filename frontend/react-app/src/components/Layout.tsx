import { Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import { Navigate } from "react-router-dom";


export function Layout(){
    return(
        <div>
            <div>
            </div>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}
export function IsAuthenticated(){
    const isAuthenticated = useAuthStore((s)=>s.isAuthenticated)
    if(isAuthenticated === false){
        return <Navigate to={'/login'}/>
    }
    return (
        <div>
            <div>
                <Outlet/>
            </div>
        </div>
    )


    
}
