"use client"
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/dist/client/components/navigation';
import Link from 'next/dist/client/link';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type FormData = {
  email: string;
  password: string;
};


const ForgotPassword = () => {
   const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
   const [otp, setOtp] = useState(["","","",""]);
   const [useremail, setuserEmail] = useState<string | null > (null);
   const[canResend, setCanResend] = useState(true);
   const[timer, setTimer] = useState(60);
   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
   const [serverError, setServerError] = useState<string | null>(null);
   const router = useRouter();

   const{ 
    register, handleSubmit, formState: { errors } 
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

    const requestOtpMutation = useMutation({
      mutationFn: async (email: string) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/forgot-password-user`, 
            { email });
        return response.data;
      },
      onSuccess: ({email}) => {
        setServerError(null);
        setuserEmail(email);
        setStep('otp');
        setCanResend(false);
        startResendTimer();
      },
      onError: (error:AxiosError) => {
        const errorMessage = (error.response ?.data as {message ?: string}) ?. message ?? "Invalid OTP!! try again";
        setServerError(errorMessage);
    },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-forgot-password-user`,
                { email: useremail, otp: otp.join('') }
            );
            return response.data;
        },
        onSuccess: () => {
            setServerError(null);
            setStep('reset');
        },
        onError: (error:AxiosError) => {
            const errorMessage = (error.response ?.data as {message ?: string}) ?. message ?? "Invalid OTP!! try again";
            setServerError(errorMessage);
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: async ({password}: { password: string }) => {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_SERVER_URI}/api/reset-password-user`,
                { email: useremail, newPassword: password }
            );
            return response.data;
        },
        onSuccess: () => {
            setStep('email');
            toast.success("Password reset successful! Please login with your new password.");
            setServerError(null);
            router.push('/login');
        },
        onError: (error:AxiosError) => {
            const errorMessage = (error.response ?.data as {message ?: string}) ?. message ?? "Failed to reset password!! try again";
            setServerError(errorMessage);
        }
    });

    const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    };
  };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      };

    const onSubmitEmail = ({email} : { email: string }) => {
        requestOtpMutation.mutate(email);
    };

    const onSubmitPassword = ({password} : { password: string }) => {
        resetPasswordMutation.mutate({ password });
    };
  return (
    <div className="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">Forgot-Password</h1>
      <p className="text-center text-lg font-medium py-3 text-[#000099]">Home . Forgot-Password</p>
      <div className="w-full justify-center items-center flex">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">

         {step === 'email' && (
            <form onSubmit={handleSubmit(onSubmitEmail)}>
              <label className="block text-gray-700 mt-4">Email</label>
              <input
                type="email"
                placeholder="example@example.com"
                className="w-full border border-gray-300 outline-0 rounded mb-1"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>}

              <button
                type="submit"
                disabled={requestOtpMutation.isPending} 
                className="w-full bg-blue-500 text-white py-2 rounded mt-6 hover:bg-blue-600 transition duration-300"
              >
                {requestOtpMutation.isPending ? "Sending OTP..." : "Submit"}
              </button>
              {serverError && <p className="text-red-500 text-sm mt-3">{serverError}</p>}
            </form>
          )}

          {step === 'otp' && (
            <div>
              <h3 className="text-xl font-semibold text-center mb-4">Enter OTP</h3>
              <p className="text-center text-gray-500 mb-4">OTP sent to {useremail}</p>
              <div className="flex justify-center gap-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => { if (el) inputRefs.current[index] = el; }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>
              <button
                className="w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg"
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>
              
              {serverError && <p className="text-red-500 text-sm mt-2">{serverError}</p>}
            </div>
          )}

          {step === 'reset' && (
            <form onSubmit={handleSubmit(onSubmitPassword)}>
              <h3 className="text-3xl font-semibold text-center mb-2">Reset Password</h3>
              <p className="text-center text-gray-500 mb-4">Enter your new password</p>

              <label className="block text-gray-700 mt-4">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Min 6 Characters"
                  className="w-full p-2 border border-gray-300 outline-0 rounded mb-1"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{String(errors.password.message)}</p>
              )}

              <button
                type="submit"
                disabled={resetPasswordMutation.isPending}
                className="w-full bg-blue-500 text-white py-2 rounded mt-6 hover:bg-blue-600 transition duration-300"
              >
                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
              </button>
              {serverError && <p className="text-red-500 text-sm mt-3">{serverError}</p>}
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword; 