import { CookieOptions } from 'express'

export function getCookieOptions({
    secure,
    days = 7,
    httpOnly = true,
}: {
    secure: boolean
    days?: number
    httpOnly?: boolean
}): CookieOptions {
    return {
        httpOnly,
        secure,
        sameSite: 'lax',
        maxAge: days * 24 * 60 * 60 * 1000, // days in milliseconds
    }
}
