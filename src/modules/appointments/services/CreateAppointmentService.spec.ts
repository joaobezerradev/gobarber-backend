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
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      user_id: 'non-existing-user',
      provider_id: '51561661161',
      date: new Date(2020, 5, 10, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('51561661161');
  });

  it('should not be able to create a new appointment on the same date', async () => {
    const appointmentDate = new Date(2020, 12, 10, 14);

    await createAppointment.execute({
      user_id: 'non-existing-user',
      provider_id: '51561661161',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        user_id: 'non-existing-user',
        provider_id: '5156166111',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 11),
        user_id: '123123',
        provider_id: '51561661161',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment with the same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 14),
        user_id: 'user',
        provider_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointment before 8am or after 18pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 5, 10, 5).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 7),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 5, 10, 18),
        user_id: 'user-id',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
