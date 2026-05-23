import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";


// Axios instance
const API_BASE_URL = axios.create({
  baseURL: "http://localhost:3000/api/",
});


// API function
export const forgetPassword = async (data) => {
  const response = await API_BASE_URL.post(
    "auth/forgot-password",
    data
  );

  return response.data;
};


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

      alert("Reset password link sent successfully");

      setFormData({
        email: "",
      });
    },

    onError: (error) => {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    },
  });

  // Form submit
  const getSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(formData);
  };

  return (
    <div>

      <h2>Forgot Password</h2>

      <form onSubmit={getSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          value={formData.email}
        />

        <button type="submit">
          {mutation.isPending
            ? "Sending..."
            : "Send Reset Link"}
        </button>

      </form>

    </div>
  );
};

export default ForgetPassword;