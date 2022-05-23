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
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'TU',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'WD',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'TH',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'FR',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'SA',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'SU',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
        ]
    })
    businessHours: businessHour[];

}