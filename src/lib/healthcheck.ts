import { NextFunction, Request, Response } from 'express'
import db from '../db'

export const healthChecker = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sqlHealthCheck = 'SELECT 1'

        await db.query(sqlHealthCheck)

        return res.json({ status: 'ok' })
    } catch (err) {
        next(err)
    }
}
