import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const services = [
    'Родительский контроль',
    'Запрет вызова',
    'Блокировка номера',
    'Определение местоположения',
    'Запись разговоров',
    'Безлимитные звонки',
    'Гибкие тарифные планы',
    'Корпоративная связь',
    'Виртуальная АТС',
    'Конференц-связь',
    'Цифровое телевидение',
    'Домашний интернет',
  ];

  for (const name of services) {
    const existing = await prisma.service.findUnique({ where: { name } });
    if (!existing) {
      await prisma.service.create({
        data: {
          name,
          activeFrom: new Date(),
          activeTo: new Date('2100-01-01'),
        },
      });
    }
  }

  console.log('Seed services completed!');

  const clients = [
    {
      firstName: 'Иван',
      lastName: 'Иванов',
      middleName: 'Иваныч',
      birthDate: new Date('1990-05-12'),
      gender: 'мужской',
      registrationDate: new Date('2025-08-14'),
      status: 'активен',
      serviceIds: [1, 2],
    },
    {
      firstName: 'Мария',
      lastName: 'Петрова',
      middleName: 'Ивановна',
      birthDate: new Date('1985-10-30'),
      gender: 'женский',
      registrationDate: new Date('2025-08-10'),
      status: 'неактивен',
      serviceIds: [3, 4],
    },
    {
      firstName: 'Алексей',
      lastName: 'Сидоров',
      middleName: 'Александрович',
      birthDate: new Date('1995-07-20'),
      gender: 'мужской',
      registrationDate: new Date('2025-08-12'),
      status: 'активен',
      serviceIds: [5, 6, 7],
    },
    {
      firstName: 'Елена',
      lastName: 'Кузнецова',
      middleName: 'Петровна',
      birthDate: new Date('1988-03-15'),
      gender: 'женский',
      registrationDate: new Date('2025-08-11'),
      status: 'активен',
      serviceIds: [8, 9],
    },
  ];

  for (const clientData of clients) {
    const existing = await prisma.client.findFirst({
      where: { firstName: clientData.firstName, lastName: clientData.lastName },
    });

    if (!existing) {
      const clientServices = clientData.serviceIds.map((serviceId) => ({ serviceId }));

      await prisma.client.create({
        data: {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          middleName: clientData.middleName,
          birthDate: clientData.birthDate,
          gender: clientData.gender,
          registrationDate: clientData.registrationDate,
          status: clientData.status,
          clientServices: {
            create: clientServices,
          },
        },
        include: {
          clientServices: {
            include: {
              service: true,
            },
          },
        },
      });
    }
  }

  console.log('Seed clients completed!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
