export interface AppointmentsInterface {
  doctor?: string;
  patient?: string;
  speciality?: string;
  scheduleDate: Date;
  approvalStatus: boolean;
  message: string;
  description: string;
}
