export interface JwtPayload {
    username: string;
    sub: string;
    userId: number;
    exp: number;
    iat: number;
}