export interface JwtPayload {
    sub: string;
    userId: number;
    exp: number;
    iat: number;
}