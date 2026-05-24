import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useState } from "react";
import { resetPassword } from "../services/api.auth";
import { useNavigate } from "react-router";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const navigation = useNavigate()

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      console.log(data);
      navigation('/login')
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({
      token,
      password,
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-24 left-0 h-72 w-72 rounded-full bg-fuchsia-400/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Security
        </p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Create a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
              New password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400"
            />
          </div>

          {mutation.isSuccess && (
            <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              Password reset successful. You can now log in with your new password.
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
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
