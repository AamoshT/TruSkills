'use client'
import { navItems } from '@/configs/constant';
import { AlignLeft, ChevronDown} from 'lucide-react';
import React, {useEffect, useState} from 'react'
import Link from "next/link";

const HeaderBottom = () => {
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    //Track scroll position
    useEffect(() => {
        const handleScroll = () => {
           if(window.scrollY > 190){
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
          
        </div>
       

        </div>

      </div>
  )
}

export default HeaderBottom;