import express from 'express'
import { verifyToken } from '../middleWare/verifyToken.js'
import { deleteMessage, getMessages, readMessage, sendMessage, updateMessage } from '../controllers/message.controller.js'
const router = express.Router()
router.post('/send_message/:chatId',verifyToken, sendMessage)
router.get('/get_all_messages/:chatId', verifyToken, getMessages)
router.put('/edit_message/:messageId', verifyToken, updateMessage)
router.delete('/delete_message/:messageId', verifyToken, deleteMessage)
router.put('/read_message/:chatId',verifyToken, readMessage )
export default router;