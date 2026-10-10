import express from 'express'
import { searchProfile } from '../controllers/searchProfile.controller.js'
const router = express.Router()

router.get('/', searchProfile )
export default router