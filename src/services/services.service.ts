import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; activeFrom?: Date; activeTo?: Date }) {
    return this.prisma.service.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.service.findMany({
      include: {
        clientServices: {
          include: { client: true }, 
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        clientServices: {
          include: { client: true },
        },
      },
    });
  }

  async update(id: number, data: { name?: string; activeFrom?: Date; activeTo?: Date }) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.prisma.clientService.deleteMany({ where: { serviceId: id } });
    return this.prisma.service.delete({ where: { id } });
  }
}
