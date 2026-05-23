import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router";
import axios from "axios";
import { useState } from "react";
import { resetPassword } from "../services/api.auth";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      console.log("sucess");
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
    <div>
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          {mutation.isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
