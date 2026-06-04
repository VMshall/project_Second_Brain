export {};

declare global {
    namespace Express {
        export interface Request {
            userId?: import('mongoose').Types.ObjectId | string;
        }
    }
}