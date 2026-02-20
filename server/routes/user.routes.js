import express from 'express'
import { verifyToken } from '../middleWare/verifyToken.js'
import { deleteUser, getFriendsInfo, getPrtcularFrnInfo, updateUser } from '../controllers/user.controller.js'
const router = express.Router()
router.get('/', verifyToken, getFriendsInfo)
router.get('/:id', verifyToken, getPrtcularFrnInfo)
router.delete('/:id', verifyToken, deleteUser)
router.put('/:id', verifyToken, updateUser)
export default router;   