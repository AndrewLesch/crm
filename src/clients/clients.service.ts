import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate: Date;
    gender: string;
    registrationDate: Date;
    status: string;
    serviceIds?: number[];
  }) {
    const clientServices = data.serviceIds?.map((serviceId) => ({ serviceId })) || [];

    return this.prisma.client.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        birthDate: new Date(data.birthDate),
        gender: data.gender,
        registrationDate: new Date(data.registrationDate),
        status: data.status,
        clientServices: {
          create: (data.serviceIds || []).map(serviceId => ({ serviceId })),
        },
      },
      include: {
        clientServices: {
          include: { service: true },
        },
      },
    });
  }

  async findAll(filters: {
    serviceIds?: number[];
    gender?: string;
    status?: string;
    birthDateFrom?: Date;
    birthDateTo?: Date;
    registrationDateFrom?: Date;
    registrationDateTo?: Date;
    sortByRegistration?: 'asc' | 'desc';
  }) {
    const where: any = {};

    if (filters.gender) where.gender = filters.gender;
    if (filters.status) where.status = filters.status;

    if (filters.birthDateFrom || filters.birthDateTo) {
      where.birthDate = {};
      if (filters.birthDateFrom) where.birthDate.gte = new Date(filters.birthDateFrom);
      if (filters.birthDateTo) where.birthDate.lte = new Date(filters.birthDateTo);
    }

  
    if (filters.registrationDateFrom || filters.registrationDateTo) {
      where.registrationDate = {};
      if (filters.registrationDateFrom) where.registrationDate.gte = new Date(filters.registrationDateFrom);
      if (filters.registrationDateTo) where.registrationDate.lte = new Date(filters.registrationDateTo);
    }

    const serviceFilter = filters.serviceIds?.length
      ? { clientServices: { some: { serviceId: { in: filters.serviceIds } } } }
      : {};

    return this.prisma.client.findMany({
      where: { ...where, ...serviceFilter },
      include: { clientServices: { include: { service: true } } },
      orderBy: filters.sortByRegistration ? { registrationDate: filters.sortByRegistration } : undefined,
    });
  }

  async findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
      include: { clientServices: { include: { service: true } } },
    });
  }

  async update(id: number, data: any) {
    if (data.serviceIds) {
      await this.prisma.clientService.deleteMany({ where: { clientId: id } });

      const clientServices = data.serviceIds.map((serviceId) => ({ clientId: id, serviceId }));
      await this.prisma.clientService.createMany({ data: clientServices });
    }

    return this.prisma.client.update({
      where: { id },
      data: { ...data, serviceIds: undefined },
      include: { clientServices: { include: { service: true } } },
    });
  }

  async remove(id: number) {
    await this.prisma.clientService.deleteMany({ where: { clientId: id } });

    return this.prisma.client.delete({ where: { id } });
  }
}
