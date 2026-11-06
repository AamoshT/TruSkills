import express, { Router } from 'express';
import { createShop,userRegistration, verifyUser, loginUser, userForgotPassword, resetUserPassword, refreshToken, getUser, registerSeller, verifySeller, loginSeller, createStripeLink, getLoggedInSeller } from '../controller/auth.controller';
import { verifyForgotPasswordOtp } from '../utils/auth.helper';
import isAuthenticated from '@packages/middleware/isAutenticated';
import { isSeller } from '@packages/middleware/authorizeRoles';
const router: Router = express.Router();
 router.post("/user-registration", userRegistration);
 router.post("/verify-user", verifyUser);
 router.post("/login-user", loginUser);
 router.post("/refresh-token-user",refreshToken);
 router.get("/logged-in-token", isAuthenticated, getUser);
 router.post("/forgot-password-user", userForgotPassword);
 router.post("/reset-password-user", resetUserPassword);
 router.post("/verify-forgot-password-user", verifyForgotPasswordOtp);
 router.post("/seller-registration", registerSeller);
 router.post("/verify-seller", verifySeller);
 router.post("/create-shop", createShop);
 router.post("/create-stripe-link", createStripeLink);
 router.post("/login-seller", loginSeller);
 router.get("/logged-in-seller", isAuthenticated, isSeller, getLoggedInSeller);

 export default router;
 
