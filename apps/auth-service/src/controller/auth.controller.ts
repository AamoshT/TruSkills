import { Request, Response, NextFunction } from 'express';
import { checkOtpRestriction, validateRegistrationData,trackOtpRequests, sendOtp, verifyOtp, handleForgotPassword, verifyForgotPasswordOtp, resetUserPassword as resetPassword} from '../utils/auth.helper';
import prisma from '@packages/libs/prisma';
import { AuthError, ValidationError } from '@packages/error-handler';
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError } from "jsonwebtoken";
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
   await sendOtp( name, email, 'user-activation-email');
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

export const refreshToken = async (req:Request ,res:Response, next:NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken; // FIX: was req.cookies.refresh_token (didn't match setCookie's 'refreshToken' name)
    // Implement refresh token logic here
    if (!refreshToken) {
      return next(new ValidationError('Refresh token not found')); // FIX: was missing next()
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as 
    { id: string, role: string };
    if (!decoded || !decoded.id) { // FIX: was decoded.id !== decoded.role, which compares unrelated fields
      return next(new AuthError('Forbidden: Invalid refresh token')); // FIX: was JsonWebTokenError (wrong usage) and missing next()
    }
    let account;
    //if (decoded.role === 'user') {
    const user = await prisma.users.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return next(new AuthError('Forbidden: User not found')); // FIX: typo "Forbiden" + missing next()
    }

    // FIX: getLoggedInUser was nested inside refreshToken (invalid) and broke the brace structure — moved out below as its own export

    const newAccessToken = jwt.sign({ 
      id: decoded.id, role: decoded.role }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });
      setCookie(res, 'accessToken', newAccessToken);
      return res.status(201).json({
        success: true,
        message: 'Access token refreshed successfully',
        accessToken: newAccessToken,
      });
  } catch (error) {
    return next(error);
  }
}; // FIX: was missing closing brace, causing everything below to be unreachable/malformed

//get logged in user
export const getLoggedInUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
     next(error);
  }
};

//user forgot password
export const userForgotPassword = async (req:Request ,res:Response, next:NextFunction) => {
    await handleForgotPassword(req, res, next, "user");
  };

  //verify forgot password OTP 
export const verifyForgotPassword = async (req:Request ,res:Response, next:NextFunction) => {
    await verifyForgotPasswordOtp(req, res, next);
};

//reset user password
export const resetUserPassword = async (req:Request ,res:Response, next:NextFunction) => {
    await resetPassword(req, res, next);
};