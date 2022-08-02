import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpSchema } from 'src/schema/otp/otp.schema';
import { VoucherCounterSchema } from 'src/schema/vouchers/vouchersCounter.schema';
import { UsersSchema } from '../../schema/user/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '9999999999s' },
        }),
        MongooseModule.forFeature([
          { name: 'User', schema: UsersSchema },
          { name: 'OTP', schema: OtpSchema },
          { name: 'Counter', schema: VoucherCounterSchema },
        ]),
      ],
      controllers: [AuthController],
      providers: [AuthService, JwtStrategy],
      module: AuthModule,
    };
  }
}
