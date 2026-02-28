"use client"
import { useRouter } from 'next/dist/client/components/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
};


const login = () => {
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
      <p className="text-center text-lg font-medium py-3  text-[#0000099]">Home . Login</p>
    </div>
  )
}

export default login