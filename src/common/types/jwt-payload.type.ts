export type JwtPayload = {
    sub: string;
    role: 'ADMIN' | 'WAREHOUSE' | 'DRIVER';
    email?: string;
    phone?: string;
};
