import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

export enum Role {
  USER = 'USER',
  EDITOR = 'EDITOR',
}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) throw new ForbiddenException('No user found');

    if (request.method === 'GET') return true;

    if (user.role !== Role.EDITOR) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }

    return true;
  }
}
