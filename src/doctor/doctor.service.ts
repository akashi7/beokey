import { ConflictException, Injectable } from '@nestjs/common';
import { Appointments, User, doctorAvailabity } from '@prisma/client';
import { getMonth } from 'date-fns';
import { AppointmentsInterface } from 'src/patient/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { scheduleAvailabilityDto } from './dto';

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

  async scheduleAvailability(
    user: User,
    dto: scheduleAvailabilityDto,
  ): Promise<void> {
    const Avaliability: doctorAvailabity[] =
      await this.prisma.doctorAvailabity.findMany({
        where: { doctorId: user.id },
      });

    const k = Avaliability.map((obj) =>
      obj.dates.map((obj) => JSON.parse(obj)),
    ).flat();

    const result = k.some((obj1) =>
      dto.dates.some(
        (obj2) =>
          obj1.date === obj2.date &&
          obj1.week === obj2.week &&
          obj1.month === obj2.month,
      ),
    );

    if (result) throw new ConflictException('date arlaedy scheduled');
    else {
      dto.dates.forEach(async (obj) => {
        await this.prisma.doctorAvailabity.create({
          data: { doctorId: user.id, dates: [JSON.stringify(obj)] },
        });
      });
      return;
    }
  }

  async seeDocShedule(id: string): Promise<doctorAvailabity[]> {
    const todayMonth = getMonth(new Date());

    const Avaliability: doctorAvailabity[] =
      await this.prisma.doctorAvailabity.findMany({
        where: { doctorId: id },
      });

    const docAvailability = Avaliability.map((obj) =>
      obj.dates.map((obj) => JSON.parse(obj)),
    ).flat();

    const filteredArray = docAvailability.filter(
      (obj) => getMonth(new Date(obj.date)) === todayMonth,
    );

    return filteredArray;
  }
}
