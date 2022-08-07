import crypto from 'crypto'

export const generateSecureKey = (length = 64): string => {
    return crypto.randomBytes(length).toString('base64')
}
