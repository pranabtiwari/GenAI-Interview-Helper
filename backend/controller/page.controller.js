import userModel from "../model/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


async function userGetMePage(req, res) {
    try {
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User detail found",
            user: {
                id: user._id,
                username: user.name,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

export default {
    userGetMePage
}