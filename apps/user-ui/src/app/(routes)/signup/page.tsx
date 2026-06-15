"use client"
import { useMutation } from '@tanstack/react-query';
import GoogleButton from '@/app/shared/components/GoogleButton';
import { Eye, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/dist/client/components/navigation';
import Link from 'next/dist/client/link';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';

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
  const [showOtp, setShowOtp] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userData, setUserData] = useState<FormData | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


  const router = useRouter();

  const {
    register, handleSubmit, watch, formState: { errors }
  } = useForm<FormData>();

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`, data);
      return response.data;
    },
    onSuccess : (_, formData ) => {
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    }
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`, 
        {
        ...userData,
        otp: otp.join("")
      }
      );
      return response.data;
    },
    onSuccess: () => {
      router.push("/login");
     }
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    signupMutation.mutate(data);
  }
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }
  const resendOtp = () => {
    if (userData){
      signupMutation.mutate(userData);
    } ;
  }

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

         {!showOtp ? (
           <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full border border-gray-300 outline-0 !rounded mb-1 p-2"
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
              className="w-full border border-gray-300 outline-0 !rounded mb-1 p-2"
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
         ) : (
            <div>
              <h3 className="text-xl font-semibold text-center mb-4">Enter OTP</h3>
              <div className="flex justify-center gap-6">
                {otp?.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref= {(el) => {                      
                      if (el) inputRefs.current[index] = el;}}
                      maxLength={1}
                      className = "w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                      value={digit}
                      onChange = {(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    />))}
            </div>
            <button className = "w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg"
            disabled ={verifyOtpMutation.isPending}
            onClick={() => verifyOtpMutation.mutate()}>
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="text-center text-sm mt-4">
              {canResend ? ( 
                <button className="text-blue-500 cursor-pointer" onClick={resendOtp}>
                  Resend OTP
                  </button>
              ) : (
                `Resend OTP in ${timer}s`
              )}
            </p>
            {
              verifyOtpMutation.isError &&
              verifyOtpMutation.error instanceof AxiosError && (
                <p className="text-red-500 text-sm mt-2">
                  {verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message}
                </p>
              )
            }

      </div>
  )}
        </div>
      </div>
    </div>
  );
};
  


  export default Signup;