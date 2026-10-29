"use client"
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/dist/client/components/navigation';
import Link from 'next/dist/client/link';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import countries from '@/utils/countries';




const Signup = () => {
    const [activeStep, setActiveStep] = useState(1);
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
  } = useForm();

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

  const onSubmit = (data: any) => {
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
    <div className="w-full flex flex-col items-center pt-10 min-h-screen">
        {/* Stepper */}
        <div className="relative flex items-center justify-between md:w-[50%] mb-8">
             <div className="absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10 "/>
            {[1,2,3].map((step) => (
              <div key={step}>
                <div
                   className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${
                    step <= activeStep ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        >

                  {step}
                  </div>
                  <span className = "ml-[-15px]">
                    {step === 1 
                    ? "Create Account" 
                    : step === 2 
                    ? "Setup Shop" 
                    : "Connect Bank" }
                  </span>
                </div>  
            ))}  
        </div>
      {/* Steps content */}
      <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
        {activeStep === 1 && (

            <>
                       {!showOtp ? (
           <form onSubmit={handleSubmit(onSubmit)}>
            <h3 className= "text-2xl font-semibold text-center mb-4">
                Create Account
            </h3>
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
              placeholder="example@example.com"
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

              {/* Phone Number */}
              <label className="block text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="660-123-456"
              className="w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1"
              {...register("phone_number", {
              
                required: "Phone Number is required",
                pattern: {
                 value: /^\+?[1-9]\d{1,14}$/, // Follows E.164 format
                  message: "Invalid phone number",
                },
                minLength: {
                    value: 10,
                    message: "Phone number must be at least 10 digits",
                },
                maxLength: {
                    value: 10,
                    message: "Phone number cannot exceed 10 digits",
                },
              })}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mb-2">{String(errors.phone_number.message)}</p>
            )}

             {/* country */}
            <label className="block text-gray-700 mb-1">Country</label>
             <select
               className="w-full p-2 border border-gray-300 outline-0 rounded-[4px]"
               {...register("country", { required: "Country is required" })}
              >
                <option value="">Select your country</option>
                {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
               ))}
               </select>
              
              {errors.country && (
                 <p className="text-red-500 text-sm">
                     {String(errors.country.message)}
                   </p>
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
              disabled={signupMutation.isPending}
              className="w-full bg-blue-500 text-white py-2 rounded mt-6 hover:bg-blue-600 transition duration-300"
              >
                {signupMutation.isPending ? "Signing up..." : "Create Account"}
                 </button>

                   {signupMutation.isError &&
                 signupMutation.error instanceof AxiosError && (
                   <p className="text-red-500 text-sm mt-2">
                    {signupMutation.error.response?.data?.message ||
                      signupMutation.error.message}
                     </p>
                       )}
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
            </>
         )}
      
      </div>
    </div>
    
    

  );
};
  


  export default Signup;