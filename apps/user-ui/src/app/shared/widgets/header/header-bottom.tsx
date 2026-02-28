'use client'
import { navItems } from '@/configs/constant';
import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart} from 'lucide-react';
import React, {useEffect, useState} from 'react'
import Link from "next/link";
import ProfileIcon from '@/assets/svgs/profile-icon';

const HeaderBottom = () => {
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    //Track scroll position
    useEffect(() => {
        const handleScroll = () => {
           if(window.scrollY > 100){
            setIsSticky(true);
           }else{ 
            setIsSticky(false);
           }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
      }, []);
  return (
    <div className ={`w-full transition-all duration-300 ${isSticky ? 'fixed top-0 left-0 z-[100] shadow-lg' : 'relative'}`}>
      <div className = {`w-[80%] relative m-auto py-3 flex items-center justify-between ${isSticky ? 'pt-3' : 'py-0'}`}>
        {/*add all drop downs*/}
        <div className={` w-[260] ${isSticky && '-mb-2'} cursor-pointer flex items-center justify-between px-5 h-[50px] bg-[#3489ff]`} onClick={() => setShow(!show)}>
          <div className='flex items-center gap-2'>
            < AlignLeft color = "#fff" />
            <span className='text-white font-medium'> All Departements</span>
          </div>
          <ChevronDown color = "#fff" />
        </div>
        {/*add all drop downs*/}
        {show && (
          <div className={`absolute top-0 left-0 ${isSticky? "top-[70px]": "top-[50px]"}
           w-[260px] h-[400px] bg-[#f5f5f5]`}>
          </div>
        )}

        {/*navigation links*/}
        <div className="flex items-center ">
          {navItems.map((i:NavItemsTypes, index:number) => (
            <Link  className ="px-5 font-medium text-lg" href={i.href} key={index}> {i.title} </Link>

            ))}
        </div>
        <div>
          {isSticky &&(
            <div className= "flex items-center gap-8">
                    <div className = 'flex items-center gap-2'>
                      <Link href={"/login"}
                      className = "border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a] ">
                        <ProfileIcon />
                      </Link>
                    <Link href = {"/login"}>
                    <span className = "block font-medium">Hello,</span>
                    <span className = "font-semibold">Sign In</span>
                    </Link>
                    </div>
                    <div className = "flex items-center gap-5">
                      <Link href ={"/wishlist"} className ="relative">
                      <HeartIcon/>
                      <div className ="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10] right-[-10]">
                        <span className ="text-white font-medium text-sm">0</span>
                      </div>
                      </Link>
                    </div>
                    <div className = "flex items-center gap-5">
                      <Link href ={"/cart"} className ="relative">
                      <ShoppingCart/>
                      <div className ="w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10] right-[-10]">
                        <span className ="text-white font-medium text-sm">0</span>
                      </div>
                      </Link>
                    </div>
            </div>
          )}
        </div>
       

        </div>

      </div>
  )
}

export default HeaderBottom;