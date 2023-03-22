import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
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
import { DoctorService } from './doctor.service';
import { scheduleAvailabilityDto } from './dto';

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

  @ApiConflictResponse({ description: 'date arleady scheduled' })
  @ApiCreatedResponse({ description: 'avalibility created succesfully' })
  @ApiOperation({ summary: 'doctor  sets availability' })
  @Post('availability')
  @ApiBody({ type: scheduleAvailabilityDto })
  async doctorSheduleAvailability(
    @GetUser() user: User,
    @Body() dto: scheduleAvailabilityDto,
  ) {
    const result = await this.doctorService.scheduleAvailability(user, dto);
    return new GenericResponse('availability made', result);
  }

  @AllowRoles(ERoles.DOCTOR, ERoles.PATIENT)
  @ApiOkResponse({ description: 'doc availability ' })
  @Get('user-availability')
  @ApiQuery({ name: 'doctorId', required: true, description: 'doctor id' })
  async seeDocAvailability(@Query('doctorId') id: string) {
    const result = await this.doctorService.seeDocShedule(id);
    return new GenericResponse('doc availability ', result);
  }
}
