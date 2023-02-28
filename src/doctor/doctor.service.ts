import { Injectable } from '@nestjs/common';
import { Appointments, User } from '@prisma/client';
import { AppointmentsInterface } from 'src/patient/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getAppointments(user: User): Promise<AppointmentsInterface[]> {
    const allApp: Appointments[] = await this.prisma.appointments.findMany({
      where: {
        doctorId: user.id,
      },
    });

    const appointments = await Promise.all(
      allApp.map(async (obj: Appointments) => {
        const patient = await this.prisma.user.findFirst({
          where: { id: obj.userId },
        });
        return {
          patient: patient.fullNames,
          scheduleDate: obj.scheduleDate,
          approvalStatus: obj.approvalStatus,
          message: obj.message,
          description: obj.description,
        };
      }),
    );

    if (appointments) return appointments;
  }
}
