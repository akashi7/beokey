import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { getYear } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { LoginDto, doctorSignUpDto, patientSignUpDto } from './dto/auth.dto';
import { ERoles } from './enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private Jwt: JwtService,
    private config: ConfigService,
  ) {}

  generateToken(user: User): { user: User; token: string } {
    const { username, id, email, role } = user;
    const token = this.Jwt.sign(
      { id, email, role, username },
      { secret: this.config.get('JWT_SECRET') },
    );
    delete user.password;
    return { user, token };
  }

  async patientSignUp(dto: patientSignUpDto): Promise<void> {
    const isUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (isUser) throw new ConflictException('Patient arleady exists');
    const password = await argon.hash(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        email: dto.email,
        fullNames: dto.fullNames,
        username: dto.username,
        password,
        gender: dto.gender,
        phone: dto.phone,
        role: ERoles.PATIENT,
      },
    });
    if (newUser) {
      const age: number = getYear(new Date()) - getYear(new Date(dto.dob));
      const patient = await this.prisma.patient.create({
        data: {
          userId: newUser.id,
          dob: dto.dob,
          age,
          spouse: dto.spouse ? dto.spouse : '',
          province: dto.province,
          district: dto.district,
          sector: dto.sector,
        },
      });
      if (patient) return;
    }
  }

  async doctorSignUp(dto: doctorSignUpDto): Promise<void> {
    const isUser = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (isUser) throw new ConflictException('Doctor arleady exists');
    const password = await argon.hash(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        id: uuidv4(),
        email: dto.email,
        fullNames: dto.fullNames,
        username: dto.username,
        password,
        gender: dto.gender,
        phone: dto.phone,
        role: ERoles.DOCTOR,
      },
    });
    if (newUser) {
      const doctor = await this.prisma.doctor.create({
        data: {
          speciality: dto.speciality,
          userId: newUser.id,
        },
      });
      if (doctor) return;
    }
  }

  async userLogin(dto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');
    else if (!(await argon.verify(user.password, dto.password))) {
      throw new ForbiddenException('Wrong User password');
    } else return this.generateToken(user);
  }
}
