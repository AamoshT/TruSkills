import express, { Router } from 'express';
import { userRegistration, verifyUser, loginUser, userForgotPassword, resetUserPassword, refreshToken, getLoggedInUser } from '../controller/auth.controller';
import { verifyForgotPasswordOtp } from '../utils/auth.helper';
import isAuthenticated from '@packages/middleware/isAutenticated';
 const router: Router = express.Router();
 router.post("/user-registration", userRegistration);
 router.post("/verify-user", verifyUser);
 router.post("/login-user", loginUser);
 router.post("/refresh-token", refreshToken);
 router.get("/logged-in-token", isAuthenticated, getLoggedInUser);
 router.post("/forgot-password-user", userForgotPassword);
 router.post("/reset-password-user", resetUserPassword);
 router.post("/verify-forgot-password-user", verifyForgotPasswordOtp);

 export default router;
 
