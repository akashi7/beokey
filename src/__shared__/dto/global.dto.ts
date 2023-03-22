import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class doctorAvailabilityDto {
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: new Date() })
  date: Date;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: '6:00 AM' })
  from: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: '17:00 PM' })
  to: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: '3' })
  week: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: '3' })
  month: string;
}
