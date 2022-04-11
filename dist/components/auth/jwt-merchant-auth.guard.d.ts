import { ExecutionContext } from '@nestjs/common';
declare const JwtMerchantAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtMerchantAuthGuard extends JwtMerchantAuthGuard_base {
    canActivate(context: ExecutionContext): boolean;
}
export {};
