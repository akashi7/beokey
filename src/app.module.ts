import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './__shared__/filters/global-exception.filter';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctor/doctor.module';
import { PrismaModule } from './prisma/prisma.module';
import { PatientModule } from './patient/patient.module';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    AdminModule,
    AuthModule,
    PrismaModule,
    DoctorModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PatientModule,
    ChatModule,
    RoomModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
