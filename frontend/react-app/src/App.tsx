
import { createBrowserRouter, RouterProvider,} from 'react-router-dom'
import Register from './routes/Register'
import Login from './routes/login'
import Home from './routes/Home'
import UserProfile from './routes/UserProfile'
import MessagePage from './routes/MessagePage'
import { IsAuthenticated, Layout } from './components/Layout'
import UserList from './routes/UserList'
import { messageLoader } from './data/messageLoader'
import { ChatLoader } from './data/chatLoader'
import { userLoader } from './data/userLoader'
import RouteError from './components/ErrorElement'
function App(){
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Layout/>,
      children:[
        {
          index:true,
          element:<Register/>
        },
        {
        path:"login",
        element:<Login/>
      },
    ]
    },
    {
      path:'/',
      element:<IsAuthenticated/>,
      errorElement:<RouteError/>,
      children:[
        {
          path:"/chats/:userId",
          loader: ChatLoader,
          element:<Home/>
        },
              {
        path:"users",
        element:<UserList/>
      },
      {
        path:'profile/:userId',
        loader: userLoader ,
        element:<UserProfile/>
      }, 
      {
        path:"chat/:userId/message",
        loader:messageLoader,
        element:<MessagePage/>
      },


      ]


    }
  ])
  return(
    <RouterProvider router={router}/>
       

  )
}
export default App