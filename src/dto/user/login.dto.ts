import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto{

    @ApiProperty({
        example: 'divideals@gmail.com',
        description: 'The email of the User',
        format: 'email',
      })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'secret password change me!',
        description: 'The password of the User',
        format: 'string',
        minLength: 5,
        maxLength: 1024,
      })
    @IsNotEmpty()
    @IsString()
    password: string;
}