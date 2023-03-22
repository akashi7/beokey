import { Injectable } from '@nestjs/common';
import { Appointments, User } from '@prisma/client';
import { ERoles } from 'src/auth/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import { appointmentDto } from './dto';
import { AppointmentsInterface } from './interfaces';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async sheduleAppointments(
    user: User,
    dto: appointmentDto,
    doctorId: string,
  ): Promise<void> {
    const appointment = await this.prisma.appointments.create({
      data: {
        userId: user.id,
        doctorId,
        description: dto.description,
        scheduleDate: new Date(dto.scheduleDate),
      },
    });
    if (appointment) return;
  }

  async getAppointments(user: User): Promise<AppointmentsInterface[]> {
    const allApp: Appointments[] = await this.prisma.appointments.findMany({
      where: {
        userId: user.id,
      },
    });

    const appointments = await Promise.all(
      allApp.map(async (obj: Appointments) => {
        const userD = await this.prisma.user.findFirst({
          where: { id: obj.doctorId },
        });
        const doctor = await this.prisma.doctor.findFirst({
          where: { userId: userD.id },
        });
        return {
          doctor: userD.fullNames,
          speciality: doctor.speciality,
          scheduleDate: obj.scheduleDate,
          approvalStatus: obj.approvalStatus,
          message: obj.message,
          description: obj.description,
        };
      }),
    );

    if (appointments) return appointments;
  }

  async seeAllDoctors(): Promise<User[]> {
    const doctors: User[] = await this.prisma.user.findMany({
      where: {
        role: ERoles.DOCTOR,
      },
    });
    doctors.forEach((item: User) => {
      delete item.password;
    });
    return doctors;
  }
}
