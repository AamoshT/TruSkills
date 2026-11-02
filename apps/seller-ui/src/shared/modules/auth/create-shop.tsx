import React from 'react'
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const CreateShop = ( {sellerId, setActiveStep}: 
    {sellerId: string, setActiveStep: (step: number) => void}) => {
        const {
            register, handleSubmit, watch, formState: { errors }
          } = useForm();
    const shopCreateMutation = useMutation({
        mutationFn : async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`, data);
            return response.data;
        },
        onSuccess: () => {
            setActiveStep(3);
        }
    });

    const onSubmit = async (data: any) => {
        const shopData = { ...data, sellerId };
        shopCreateMutation.mutate(shopData);
    };
    const countWords = (text: string) => text.trim().split(/\s+/).length;
    


  return (
    <div>
        <form onSubmit={handleSubmit(onSubmit)}>
           <h3 className="text-xl font-semibold text-center mb-4">Setup Your Skill</h3>
            <label className= "block text-gray-700 font-medium mb-1">
                Skill Name* </label>
            <input
              type="text"
              {...register("name", { required: "Skill name is required" })}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mb-2">{String(errors.name.message)}</p>
            )}
            <label className= "block text-gray-700 font-medium mb-1">
                Bio* </label>
            <textarea 
              cols={10}
              rows={4}
              placeholder="Enter your bio"
              {...register("bio", { required: "Bio is required",
                validate:(value) => countWords(value) <= 100 || "Bio must be at most 100 words long"
              })}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            ></textarea>
            {errors.bio && (
              <p className="text-red-500 text-sm mb-2">{String(errors.bio.message)}</p>
            )}
              

        </form>

    </div>
  )
}

export default CreateShop