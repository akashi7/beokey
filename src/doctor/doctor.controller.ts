import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { AllowRoles, GetUser } from 'src/auth/decorators';
import { ERoles } from 'src/auth/enums';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DoctorService } from './doctor.service';

@Controller('doctor')
@ApiTags('doctor')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
@AllowRoles(ERoles.DOCTOR)
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @ApiOperation({ summary: 'doctor  appointment lists' })
  @Get('appointments')
  async getDoctorAppointments(@GetUser() user: User) {
    const result = await this.doctorService.getAppointments(user);
    return new GenericResponse('all apointments', result);
  }
}
