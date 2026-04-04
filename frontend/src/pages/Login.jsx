import React, { useState } from 'react'
import { authLogin } from '../services/api.auth.js'
import { useNavigate } from 'react-router'


const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const data = await authLogin(formData.email, formData.password)
            navigate('/')
            console.log("Login successful")
        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl px-8 py-10">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
                    >
                        {
                            loading ? "Logging in..." : "Login"
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login