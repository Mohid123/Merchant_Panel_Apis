import { ApiProperty } from '@nestjs/swagger';
import { businessHour } from '../../interface/user/users.interface';

export class UpdateHoursDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @ApiProperty({
    example: [
      {
        day: 'MN',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
        isWorkingDay: true,
      },
      {
        day: 'TU',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
        isWorkingDay: true,
      },
      {
        day: 'WD',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
        isWorkingDay: true,
      },
      {
        day: 'TH',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
        isWorkingDay: true,
      },
      {
        day: 'FR',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
        isWorkingDay: true,
      },
      {
        day: 'SA',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
        isWorkingDay: true,
      },
      {
        day: 'SU',
        firstStartTime: '',
        firstEndTime: '',
        secondStartTime: '',
        secondEndTime: '',
        isWorkingDay: true,
      },
    ],
  })
  businessHours: businessHour[];
}
