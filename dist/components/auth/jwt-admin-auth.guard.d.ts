import { ExecutionContext } from '@nestjs/common';
declare const JwtAdminAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAdminAuthGuard extends JwtAdminAuthGuard_base {
    canActivate(context: ExecutionContext): boolean;
}
export {};
