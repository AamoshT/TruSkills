import crypto from 'crypto';
import { ValidationError } from '@packages/error-handler';
import redis from '@packages/libs/redis';
import { sendEmail } from './sendMail';
import prisma from '@packages/libs/prisma';
import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs';
import { error } from 'console';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data : any, usertype: "user" | "seller")=>{
    const {name, email, password, phone_number, country } = data;
    if(
        !name ||
        !email ||
        !password ||
        (usertype === "seller" && (!phone_number || !country))
    ) {
        throw new ValidationError ('Missing required registration fields');
    }
    if (!emailRegex.test(email)) {
        throw new ValidationError ('Invalid email format');
    }
}

export const checkOtpRestriction = async (email:string, next:NextFunction) => {
    if (await redis.get(`otp_lock:${email}`)) {
        return next(new ValidationError('Account locked due to multiple failed attempts!  Try again after 30mins'));
        }
    
    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new ValidationError('Please wait 1min before requesting a new OTP'));

}
if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(new ValidationError('Too many OTP requests! Please try again after 1 hour'));
}

}

export const trackOtpRequests = async (email:string, next:NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequests = parseInt(await redis.get(otpRequestKey) || '0');
    if (otpRequests >= 2){ 
        await redis.set(`otp_spam_lock:${email}`, 'locked', "EX", 3600);//1 hour lock
        return next(new ValidationError('Too many OTP requests! Please try again after 1 hour'));
    }
    await redis.set(otpRequestKey, otpRequests+1, "EX", 3600);//count resets after 1 hour'
    
}

export const sendOtp = async (name :string, email:string, template:string) => {
    const otp = crypto.randomInt(1000, 9999).toString();
    await sendEmail(email, "Verify your Email", template, { name, otp });
    await redis.set (`otp:${email}`, otp,"EX", 300);
    await redis.set(`otp_cooldown:${email}`, "true" , "EX", 60);

}
 export const verifyOtp = async (email:string, otp:string, next:NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp) {
        throw next(new ValidationError('Invalid or expired OTP'));
    }
    
    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

    if ( storedOtp !== otp) {
        if (failedAttempts >= 2) { 
            await redis.set(`otp_lock:${email}`, 'locked', "EX", 1800); //30 mins lock
            await redis.del(`otp:${email}`, failedAttemptsKey); //reset failed attempts
            throw next(new ValidationError('Account locked due to multiple failed attempts! Try again after 30mins'));
        }
        await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
        throw next ( new ValidationError(`Invalid OTP. ${2 - failedAttempts} attempts left`));
    }

    await redis .del(`otp:${email}`, failedAttemptsKey);

    
}
// Additional helper functions for password reset
export const handleForgotPassword = async (req:Request ,res:Response, next:NextFunction, userType: "user" | "seller" ) => {
    try {
        const {email} = req.body;
        if (!email)throw new ValidationError('Email is required');
        //find user by email
        const user = userType === "user" && await prisma.users.findUnique({ where: { email } });
        if (!user) {
            throw new ValidationError('Email not found');
        }
        //check otp request restrictions
        await checkOtpRestriction(email, next);
        await trackOtpRequests(email, next);

        //generate and send OTP for password reset
        await sendOtp(user.name, email, 'forgot-password-user-mail');
        res.status(200).json({
            message: 'OTP sent to your email address.Please verify your account',
        });

    } catch (error) {
         next (error);
    }
}
//reset user password
export const resetUserPassword = async (req:Request ,res:Response, next:NextFunction) => {
    try {
        const {email,newPassword} = req.body;
        if (!email || !newPassword) {
            return  next(new ValidationError('Email and new password are required') );
        }
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user)  return next(new ValidationError("User not found!"));
        
        //compare new password with old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password!);
        if (isSamePassword) {
            return next(new ValidationError('New password cannot be the same as the old password'));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.users.update({ where: { email }, data: { password: hashedPassword } });
        res.status(200).json({
            message: 'Password reset successful',
        });
           
    
    } catch (error) {
        next (error);
    }
}

export const verifyForgotPasswordOtp = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {email, otp} = req.body;
        if (!email || !otp) {
            throw new ValidationError('Email and OTP are required!');
        }

        await verifyOtp(email, otp, next);
        res.status(200).json({
            message: 'OTP verified successfully. You can now reset your password.',
        });
    } catch (error){

     next (error);  
}
}
