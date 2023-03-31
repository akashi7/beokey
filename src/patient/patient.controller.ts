import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { appointmentDto } from './dto';
import { PatientService } from './patient.service';

@Controller('patient')
@ApiTags('patient')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
@AllowRoles(ERoles.PATIENT)
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class PatientController {
  constructor(private readonly patient: PatientService) {}

  @ApiCreatedResponse({ description: 'appoinmtent created' })
  @ApiBody({ type: appointmentDto })
  @ApiQuery({ name: 'doctorId', required: true, description: 'doctor id' })
  @ApiOperation({ summary: 'patient make appointment' })
  @Post('make-appointment')
  async createAppointment(
    @Body() dto: appointmentDto,
    @GetUser() user: User,
    @Query('doctorId') doctorId: string,
  ) {
    const result = await this.patient.sheduleAppointments(user, dto, doctorId);
    return new GenericResponse('created appointment', result);
  }

  @ApiOkResponse({ description: 'all patient appointments' })
  @ApiOperation({ summary: 'all patient appointments' })
  @Get('my-appointment')
  async getAppointments(@GetUser() user: User) {
    const result = await this.patient.getAppointments(user);
    return new GenericResponse('all my appointments', result);
  }

  @ApiOkResponse({ description: 'all doctors fetched' })
  @ApiOperation({ summary: 'see all doctors' })
  @Get('all-doctors')
  async getAllDoctors() {
    const result = await this.patient.seeAllDoctors();
    return new GenericResponse('all doctors', result);
  }
}
