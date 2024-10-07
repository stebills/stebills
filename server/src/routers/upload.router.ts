import express from 'express'
import { postUpload } from '../controllers/upload.controller'

const router = express.Router()

// upload
router.route('/upload').post(postUpload)
// router.post('/upload', postUpload)

export default router
