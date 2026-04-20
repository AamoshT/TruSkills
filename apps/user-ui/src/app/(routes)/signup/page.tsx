"use client"
import GoogleButton from '@/app/shared/components/GoogleButton';
import { Eye, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/dist/client/components/navigation';
import Link from 'next/dist/client/link';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register, handleSubmit, watch, formState: { errors }
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {}

  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">Sign Up</h1>
      <p className="text-center text-lg font-medium py-3 text-[#000099]">Home . Sign Up</p>
      <div className="w-full justify-center items-center flex">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">Create an Account</h3>
          <p className="text-center text-gray-500 mb-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
          </p>

          <GoogleButton />
          <div className="flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-3">Or Sign up with Email</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="  John Doe"
              className="w-full border border-gray-300 outline-0 rounded mb-1 p-2"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters"
                }
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mb-2">{String(errors.name.message)}</p>
            )}

            {/* Email */}
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="  example@example.com"
              className="w-full border border-gray-300 outline-0 rounded mb-1 p-2"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">{String(errors.email.message)}</p>
            )}

            {/* Password */}
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder=" Min 6 Characters"
                className="w-full p-2 border border-gray-300 outline-0 rounded mb-1"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
              <button
                type="button"
                className="absolute inset-y-3 right-3 flex text-gray-400"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <Eye /> : <EyeOffIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mb-2">{String(errors.password.message)}</p>
            )}

            {/* Confirm Password */}
            <label className="block text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder=" Re-enter your password"
                className="w-full p-2 border border-gray-300 outline-0 rounded mb-1"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match"
                })}
              />
              <button
                type="button"
                className="absolute inset-y-3 right-3 flex text-gray-400"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? <Eye /> : <EyeOffIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mb-2">{String(errors.confirmPassword.message)}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded mt-6 hover:bg-blue-600 transition duration-300"
            >
              Create Account
            </button>
            {serverError && <p className="text-red-500 text-sm mt-3">{serverError}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup;