import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
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
import { RoomService } from './room.service';

@Controller('room')
@ApiTags('room')
@UseGuards(JwtGuard, RolesGuard)
@ApiBearerAuth()
@AllowRoles(ERoles.DOCTOR, ERoles.PATIENT)
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class RoomController {
  constructor(private readonly room: RoomService) {}

  @ApiOkResponse({ description: 'all mesaages' })
  @ApiQuery({ name: 'id', required: true, description: 'receptient id' })
  @Get('get-room')
  async getConversation(@GetUser() user: User, @Query('id') id: string) {
    const result = await this.room.getConversation(user, id);
    return new GenericResponse('messages', result);
  }

  @ApiOkResponse({ description: 'all convo' })
  @Get('convo')
  async getDocConvo(@GetUser() user: User) {
    const result = await this.room.getDocConversation(user);
    return new GenericResponse('convo', result);
  }
}
