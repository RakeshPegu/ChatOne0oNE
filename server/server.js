import express from 'express'
import errorMid from './middleWare/errorMiddleWare.js'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'
import chatRoutes from './routes/chat.routes.js'
import messageRoutes from './routes/message.routes.js'
import searchRoute from './routes/search.route.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import {createServer} from 'node:http'
import {Server} from 'socket.io'
import dns from 'node:dns'
import cors from 'cors'
import cookie from 'cookie'
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors:{
        origin: process.env.BASE_URL,
        methods:['GET', 'POST'],
        credentials:true
    }
})
app.use(express.json())
app.use(cookieParser())
const port = process.env.PORT
app.use(cors({origin:process.env.BASE_URL, credentials:true}))
app.get('/api/v1/response', (req, res)=>{
    res.status(200).json({success:true, message:'responsed from the backend recieved successfully'})
})
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/chats', chatRoutes)
app.use('/api/v1/search_users',searchRoute)
app.use('/api/v1/messages', messageRoutes)
app.set('io', io)
import jwt from "jsonwebtoken";
import { createMessage } from './utility/messages.service.js'

io.use((socket, next) => {
  try {

   
    const rawCookie= socket.handshake.headers.cookie || ''
    if(!rawCookie){
        return next(new Error('Cookie not found'))
    }
    const parserCookie = cookie.parse(rawCookie)
    const token = parserCookie.token 

    if (!token) return next(new Error("Authentication error"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.userId = decoded.id;

    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
    socket.on("join-room", (chatId) => {
    socket.join(chatId);
  });
  socket.on("msg", async ({ chatId, text }) => {

    if (!socket.userId) return;

    const newMessage = await createMessage({
      chatId,
      text,
      senderId: socket.userId
    });
    io.to(chatId).emit("recieve-msg", newMessage);
  });



  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Database has been connected successfully');
    console.log("Database name:", mongoose.connection.name);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
};

connectDB();
app.use(errorMid)

server.listen(port, ()=>{
    console.log(`the server is listening on port ${port}`)
})