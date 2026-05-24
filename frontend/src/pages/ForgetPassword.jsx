import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgetPassword } from "../services/api.auth";


const ForgetPassword = () => {

  const [formData, setFormData] = useState({
    email: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // React Query Mutation
  const mutation = useMutation({
    mutationFn: forgetPassword,

    onSuccess: (data) => {
      console.log(data);

      setFormData({
        email: "",
      });
    },

    onError: (error) => {
      console.log(error);
    },
  });

  // Form submit
  const getSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(formData);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Account Recovery
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Forgot your password?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Enter your email and we will send you a secure reset link.
        </p>

        <form onSubmit={getSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={handleChange}
              value={formData.email}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400"
            />
          </div>

          {mutation.isSuccess && (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              Reset link sent successfully. Check your inbox.
            </p>
          )}

          {mutation.isError && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {mutation.error?.response?.data?.message || "Something went wrong"}
            </p>
          )}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;