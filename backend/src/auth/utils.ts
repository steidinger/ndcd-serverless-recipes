import { decode, JwtHeader } from 'jsonwebtoken'

/**
 * A payload of a JWT token
 */
export interface JwtPayload {
    iss: string
    sub: string
    iat: number
    exp: number
}

/**
 * Interface representing a JWT token
 */
export interface Jwt {
    header: JwtHeader
    payload: JwtPayload
}

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string): string {
    const decodedJwt = decode(jwtToken) as JwtPayload
    return decodedJwt.sub
}
