import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class appointmentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: '10-05-2022' })
  scheduleDate: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'appointment for headache',
  })
  description: string;
}
