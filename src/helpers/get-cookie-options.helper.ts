import { CookieOptions } from 'express'

export function getCookieOptions({
    secure,
    days = 7,
}: {
    secure: boolean
    days?: number
}): CookieOptions {
    return {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        maxAge: days * 24 * 60 * 60 * 1000, // days in milliseconds
    }
}
