import { Request, Response, NextFunction } from 'express';
import { checkOtpRestriction, validateRegistrationData,trackOtpRequests, sendOtp, verifyOtp, handleForgotPassword, verifyForgotPasswordOtp} from '../utils/auth.helper';
import prisma from '@packages/libs/prisma';
import { AuthError, ValidationError } from '@packages/error-handler';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { setCookie } from '../utils/cookies/setCookie';


export const userRegistration = async (req:Request ,res:Response, next:NextFunction) => {
    try {
      validateRegistrationData(req.body, "user");
    const { name, email } = req.body;

    const existingUser = await prisma.users.findUnique({where:{ email } });

 if (existingUser) {
    return next(new ValidationError('Email already in use'));
 };
   await checkOtpRestriction(email, next);
   await trackOtpRequests(email,next);
   await sendOtp( email, name, 'user-activation-email');
   res.status (200).json({
      message: 'OTP sent to your email address',
   })
    } catch (error) {
      return next (error);
    }
};

//verify user OTP controller
export const verifyUser = async (req:Request ,res:Response, next:NextFunction) => {
    try {
      const {email,otp,password,name} = req.body;
      if(!email || !otp || !password || !name){
        return next(new ValidationError('All fields are required!'));
      }
      const existingUser = await prisma.users.findUnique({where:{ email } });
      if (existingUser) {
        return next(new ValidationError('Email already in use'));
     }

     await verifyOtp(email, otp, next);
     const hashedPassword = await bcrypt.hash(password, 10);
     await prisma.users.create({
      data :{ name, email, password: hashedPassword }
     })
      res.status(201).json({
        success : true,
        message : 'User registered successfully',
      });
 
    }
    catch (error) { 
      return next (error);
    }
};

//login user
export const loginUser = async (req:Request ,res:Response, next:NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError('Email and password are required'));
    }
   const user = await prisma.users.findUnique({ where: { email } });
   if (!user)
     return next(new AuthError('Invalid email or password'));
   const isMatch = await bcrypt.compare(password, user.password!);
   if (!isMatch){
     return next(new AuthError('Invalid email or password'));  
    }
     //generate access and refresh token
     const accessToken = jwt.sign ({id:user.id, role :"user"},
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn :  '15m',
      }
     );
      const refreshToken = jwt.sign ({id:user.id, role :"user"},
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn :  '7d',
      }
     );
     //store and access token in http only secure cookie
     setCookie(res, 'refreshToken', refreshToken);
     setCookie(res, 'accessToken', accessToken);
      res.status (200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name : user.name,
        }
      });
    } catch (error) {
      return next (error);
    }
  };

//user forgot password
export const userForgotPassword = async (req:Request ,res:Response, next:NextFunction) => {
    await handleForgotPassword(req, res, next, "user");
  };

  //verify forgot password OTP 
export const verifyUserForgotPassword = async (req:Request ,res:Response, next:NextFunction) => {
    await verifyForgotPasswordOtp(req, res, next);
};

//reset user password
export const resetUserPassword = async (req:Request ,res:Response, next:NextFunction) => {
    await resetUserPassword(req, res, next);
};