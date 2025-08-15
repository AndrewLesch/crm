import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() body: any) {
    return this.clientsService.create(body);
  }

  @Get()
  findAll(@Query('serviceIds') serviceIds: string, @Query() query: any) {
    let serviceIdsArray: number[] | undefined;

    if (serviceIds) {
      serviceIdsArray = serviceIds.split(',').map(id => parseInt(id, 10));
    }

    return this.clientsService.findAll({
      ...query,
      serviceIds: serviceIdsArray,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.clientsService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientsService.remove(+id);
  }
}
