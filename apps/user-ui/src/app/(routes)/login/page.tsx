"use client"
import GoogleButton from '@/app/shared/components/GoogleButton';
import { Eye, EyeOffIcon} from 'lucide-react';
import { useRouter } from 'next/dist/client/components/navigation';
import Link from 'next/dist/client/link';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};


const Login = () => {
   const [passwordVisible, setPasswordVisible] = useState(false);
   const [serverError, setServerError] = useState<string | null>(null);
   const [rememberMe, setRememberMe] = useState(false);
   const router = useRouter();

   const{ 
    register, handleSubmit, formState: { errors } 
        } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {}
  return(
    <div className ="w-full py-10 min-h-[85vh] bg-[#f1f1f1]">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">Login</h1>
      <p className="text-center text-lg font-medium py-3  text-[#000099]">Home . Login</p>
      <div className ="w-full justify-center items-center flex">
        <div className=" md:w-[480px] p-8 bg-white shadow rounde-lg ">
          <h3 className = "text=3xl font-semibold text-center mb-2" > Login to TruSkills </h3>
          <p className= " text-center text-gray-500 mb-4"> Dont Have an account?
            <Link href="/signup" className="text-blue-500">
              Sign up
            </Link>
          </p>

          <GoogleButton />
          <div className = "flex items-center my-5 text-gray-400 text-sm">
            <div className="flex-1 border-t border-gray-300"/>
            <span className ="px-3"> Or Sign in with Email</span>
            <div className="flex-1 border-t border-gray-300"/>
          </div>

          <form onSubmit ={handleSubmit(onSubmit)}>
            <label className =" block text-gray-700 mb-1"> Email </label>
            <input type="email" placeholder="  example@example.com"
            className = "w-full border border-gray-300 outline-0 rounded mb-1"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address"
              }
            })}
            />
            {errors.email && (
              <p className = "text-red-500 text-sm"> {String(errors.email.message)}</p>
            )}
            {errors.email && <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>}
            <label className =" block text-gray-700 mb-1"> Password </label>
            <div className="relative">
              <input type={passwordVisible ? "text" : "password"} placeholder=" Min 6 Characters"
              className = "w-full p-2 border border-gray-300 outline-0 rounded mb-1"
              {
                ...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
              />
              <button type="button" className=" absolute inset-y-3 right-3 flex  text-gray-400" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <Eye /> : <EyeOffIcon />}
              </button>
             {errors.password && (
              <p className = "text-red-500 text-sm"> {String(errors.password.message)}</p>
              )}
            
              <div className="flex items-center mt-4">
                <label className = "flex items-center text-gray-600">
                <input type="checkbox" id="rememberMe" className="mr-2" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                Remember Me 
                </label>
                <Link href="/forgot-password" className="ml-auto text-blue-500 text-sm">
                  Forgot Password?
                </Link>
              </div>   
              <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-6 hover:bg-blue-600 transition duration-300">
                Login
              </button>
               {serverError && <p className="text-red-500 text-sm mt-3">{serverError}</p>}
            </div>
          </form>
        </div>
    </div>
    </div>
  )
}

export default Login; 