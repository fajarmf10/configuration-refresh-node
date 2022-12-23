import { Request, NextFunction, Response } from 'express';

export const errorHandler = () => {
    return (err: any, req: Request, res: Response, next: NextFunction) => {
        return res.status(500).send({
            error_code: 'SERVER_ERROR',
            message: 'Something unexpected happened, we are investigating this issue right now',
        });
    };
};
