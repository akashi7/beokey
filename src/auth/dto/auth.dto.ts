import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class patientSignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'kukushi' })
  username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'krishna' })
  fullNames: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'email',
    required: true,
    default: 'akashichris7@gmauil.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'male' })
  gender: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true, default: 782090020 })
  phone: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: '10-02-2000' })
  dob: string;
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  spouse: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'kigali' })
  province: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'gasabo' })
  district: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'karuruma' })
  sector: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'kabisoza' })
  password: string;
}

export class doctorSignUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'akashi' })
  password: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'akashi' })
  username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'christian' })
  fullNames: string;
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'email',
    required: true,
    default: 'christiannseko@gmail.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'Male' })
  gender: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, required: true, default: 781273704 })
  phone: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'cover' })
  speciality: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'email',
    required: true,
    default: 'akashichris7@gmauil.com',
  })
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'akashi' })
  password: string;
}
