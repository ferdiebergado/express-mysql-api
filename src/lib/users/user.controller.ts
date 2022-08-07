import { Request, Response, NextFunction } from 'express'
import { findUserById } from './user'

export default {
    getUser: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id

            const user = await findUserById(Number(id))

            res.json(user)
        } catch (error) {
            next(error)
        }
    },
}
