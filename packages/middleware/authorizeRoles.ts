import { AuthError } from "@packages/error-handler";
import { NextFunction, Request, Response } from "express";


export const isSeller = (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== "seller") {
        return next(new AuthError("Access denied: You do not have permission to access this resource"));
    }
};

export const isUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.role !== "user") {
        return next(new AuthError("Access denied: You do not have permission to access this resource"));
    }
};

