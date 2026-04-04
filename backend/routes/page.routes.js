import { Router } from "express"
import pageUser from "../controller/page.controller.js" 
import {authMiddleware} from "../middleware/user.middleware.js"

const router = Router()

router.get('/getme', authMiddleware, pageUser.userGetMePage)




export default router