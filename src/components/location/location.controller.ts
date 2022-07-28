import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LocationDTO } from 'src/dto/location/location.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtMerchantAuthGuard } from '../auth/jwt-merchant-auth.guard';
import { LocationService } from './location.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private readonly _locationService: LocationService) {}

  @UseGuards(JwtMerchantAuthGuard)
  @Post('createLocation')
  createDeal(@Body() locationDto: LocationDTO) {
    return this._locationService.createLocation(locationDto);
  }
}
