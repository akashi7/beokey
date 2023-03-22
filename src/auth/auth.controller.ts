import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { AuthService } from './auth.service';
import { LoginDto, doctorSignUpDto, patientSignUpDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ description: 'Patient created successfully' })
  @ApiConflictResponse({ description: 'Patient already exists' })
  @ApiBody({ type: patientSignUpDto })
  @ApiOperation({ summary: 'patient signup ' })
  @Post('patient-signup')
  async registerPatient(@Body() dto: patientSignUpDto) {
    const result = await this.authService.patientSignUp(dto);
    return new GenericResponse('Patient registered ok', result);
  }

  @ApiCreatedResponse({ description: 'Doctor created successfully' })
  @ApiConflictResponse({ description: 'Doctor already exists' })
  @ApiBody({ type: doctorSignUpDto })
  @ApiOperation({ summary: 'doctor signup ' })
  @Post('doctor-signup')
  async registerDoctor(@Body() dto: doctorSignUpDto) {
    const result = await this.authService.doctorSignUp(dto);
    return new GenericResponse('Doctor registered ok', result);
  }

  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden User' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOperation({ summary: 'user login ' })
  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @Post('user-login')
  async userLogin(@Body() dto: LoginDto) {
    const result = await this.authService.userLogin(dto);
    return new GenericResponse('user logged in success', result);
  }
}
