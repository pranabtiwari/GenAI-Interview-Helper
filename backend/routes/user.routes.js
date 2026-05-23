import { Router } from "express"
import userController from "../controller/user.controller.js"

const router = Router()



router.post('/auth/register', userController.registerAuthController)
router.post('/auth/login', userController.userLoginController)
router.delete('/auth/logout', userController.userLogOutController)
router.post('/auth/forgot-password', userController.userForgetPasswordController)
router.post('/auth/reset-password/:token', userController.resetPasswordController)


export default router