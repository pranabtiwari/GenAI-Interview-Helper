import userModel from "../model/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

async function registerAuthController(req, res) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Plase enter the User Credintial"
            })
        }

        const ifUserIsAvailable = await userModel.findOne({
            $or: [{ email }]
        })

        if (ifUserIsAvailable) {
            return res.status(400).json({
                message: "User alredy available"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)


        const user = await userModel.create({
            name,
            email,
            password: hashPassword
        })

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_KEY,
            { expiresIn: "1d" }
        )
        res.status(201).json({
            message: "User had been created",
            token,
            user
        })




    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

async function userLoginController(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter some credential"
            })
        }

        const userCheck = await userModel.findOne({ email })

        if (!userCheck) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const checkPassword = await bcrypt.compare(password, userCheck.password)

        if (!checkPassword) {
            return res.status(400).json({
                message: "Invalid credintial"
            })
        }

        const token = jwt.sign(
            { id: userCheck._id },
            process.env.JWT_KEY,
            { expiresIn: "1d" }

        )

        res.status(200).json({
            message: "Login Sucessful",
            token

        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

async function userLogOutController(req, res) {
    try {
        return res.status(200).json({
            message: "Logout successful"
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

export default {
    registerAuthController,
    userLoginController,
    userLogOutController
}