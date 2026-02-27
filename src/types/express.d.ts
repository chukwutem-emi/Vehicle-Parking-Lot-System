import "express";

/**
 * Extending express request.
 * By default express has no userId. So i have to argument the request type globally.
 * Now req.userId is valid everywhere.
 */
declare module "express-serve-static-core" {
    interface Request {
        userId?: number;
    };
};