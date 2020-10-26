import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../infra/typeorm/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointments: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointments = new FakeAppointmentsRepository();

    createAppointment = new CreateAppointmentService(fakeAppointments);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      user_id: 'non-existing-user',
      provider_id: '51561661161',
      date: new Date(),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('51561661161');
  });

  it('should not be able to create a new appointment on the same date', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      user_id: 'non-existing-user',
      provider_id: '51561661161',
      date: appointmentDate,
    });

    expect(
      createAppointment.execute({
        user_id: 'non-existing-user',
        provider_id: '51561661161',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
