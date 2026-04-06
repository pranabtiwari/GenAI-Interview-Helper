import { Router } from "express"
import userController from "../controller/user.controller.js"

const router = Router()



router.post('/auth/register', userController.registerAuthController)
router.post('/auth/login', userController.userLoginController)
router.post('/auth/logout', userController.userLogOutController)


export default router