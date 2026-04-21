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
            await authLogin(formData.email, formData.password)
            navigate('/')
            console.log("Login successful")
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-page w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 font-sans flex items-center justify-center px-4 py-10">
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(15,23,42,0.75)] backdrop-blur-xl p-8">
                <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_45%),_radial-gradient(circle_at_bottom,_#22c55e_0,_transparent_45%)]" />

                <div className="relative space-y-6">
                    <header className="space-y-2 text-center">
                        <h1 className="text-2xl font-semibold text-slate-50">
                            Welcome back
                        </h1>
                        <p className="text-sm text-slate-400">
                            Sign in to continue preparing for your next interview.
                        </p>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1 text-left">
                            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-1 text-left">
                            <label className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className='flex justify-end gap-4'>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => navigate("/register")}
                                    disabled={loading}
                                    className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-100 hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Register
                                </button>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/40 hover:from-indigo-400 hover:via-sky-400 hover:to-emerald-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}

export default Login