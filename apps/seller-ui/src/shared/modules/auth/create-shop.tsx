import React from 'react'
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { shopCategories } from '@/utils/categories';

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
                Bio* (Max 100 words) </label>
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

            <label className= "block text-gray-700 font-medium mb-1">
                Address*  </label>
            <input
              type="text"
              placeholder="Enter your address"
              {...register("address", { required: "Address is required" })}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mb-2">{String(errors.address.message)}</p>
            )}
            
            <label className= "block text-gray-700 font-medium mb-1">
                Operating hours*  </label>
            <input
              type="text"
              placeholder="Enter your operating hours"
              {...register("operatingHours", { required: "Operating hours is required" })}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            {errors.operatingHours && (
              <p className="text-red-500 text-sm mb-2">{String(errors.operatingHours.message)}</p>
            )}
            
            <label className= "block text-gray-700 font-medium mb-1">
                Website  </label>
            <input
              type="url"
              placeholder="https://example.com"
              {...register("website", { 
                pattern: {
                  value: /^https?:\/\/.+\..+/,
                  message: "Please enter a valid URL"
                },
               })}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            {errors.website && (
              <p className="text-red-500 text-sm mb-2">{String(errors.website.message)}</p>
            )}

            <label className="block text-gray-700 mb-1">Category *</label>
              <select
                className="w-full p-2 border border-gray-300 outline-0 rounded"
                  {...register("category", { required: "Category is required" })}
                  >
              <option value="">Select a category</option>
                {shopCategories.map((category) => (
              <option key={category.value} value={category.value}>
              {category.label}
              </option>
                ))}
              </select>
                {errors.category && (
                  <p className="text-red-500 text-sm">
                    {String(errors.category.message)}
                  </p>
                )}
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
                  Create
                </button>

        </form>

    </div>
  )
}

export default CreateShop