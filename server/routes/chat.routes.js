import express from 'express'
import { createChat, deleteChat, getAnyPrtclrChat, getChats } from '../controllers/chat.controller.js'
import { verifyToken } from '../middleWare/verifyToken.js'
const router = express.Router()
router.post('/:userId',verifyToken, createChat)
router.get('/:userId', verifyToken, getChats)
router.get('/get_particular_chat/:userId', verifyToken, getAnyPrtclrChat)
router.delete('/:chatId', verifyToken, deleteChat)

export default router;