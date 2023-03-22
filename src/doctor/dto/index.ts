import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { doctorAvailabilityDto } from 'src/__shared__/dto/global.dto';

export class scheduleAvailabilityDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ isArray: true, required: true, type: doctorAvailabilityDto })
  dates: doctorAvailabilityDto[];
}
