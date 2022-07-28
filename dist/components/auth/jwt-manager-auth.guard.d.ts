import { ExecutionContext } from '@nestjs/common';
declare const JwtManagerAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtManagerAuthGuard extends JwtManagerAuthGuard_base {
    canActivate(context: ExecutionContext): boolean;
}
export {};
