import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { businessHour } from "../../interface/user/users.interface";

export class SignUpDTO {

    //Credentials

    @ApiProperty()
    @IsNotEmpty()
    email: string;

    // @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(5)
    // @MaxLength(1024)
    // password: string;

    // Personal Details

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string

    @ApiProperty()
    phoneNumber: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    status: string;

    // Business Details

    @ApiProperty()
    businessType: string;

    @ApiProperty()
    companyName: string;

    @ApiProperty()
    streetAddress: string;

    @ApiProperty()
    zipCode: number;

    @ApiProperty()
    city: string;

    @ApiProperty()
    province: string;

    @ApiProperty()
    website_socialAppLink: string;

    @ApiProperty()
    newUser: boolean;

    //Business Hours

    @ApiProperty({
        example: [
            {
                day: 'MN',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: ''
            },
            {
                day: 'TU',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: ''
            },
            {
                day: 'WD',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: ''
            },
            {
                day: 'TH',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: ''
            },
            {
                day: 'FR',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: ''
            },
            {
                day: 'SA',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: ''
            },
            {
                day: 'SU',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: ''
            },
        ]
    })
    businessHours: businessHour[];

}