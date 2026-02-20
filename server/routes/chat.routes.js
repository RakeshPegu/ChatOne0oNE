import express from 'express'
import { createChat, deleteChat, getAnyPrtclrChat, getChats } from '../controllers/chat.controller.js'
import { verifyToken } from '../middleWare/verifyToken.js'
const router = express.Router()
router.post('/:userId',verifyToken, createChat)
router.get('/', verifyToken, getChats)
router.get('/:userId', verifyToken, getAnyPrtclrChat)
router.delete('/:chatId', verifyToken, deleteChat)

export default router;