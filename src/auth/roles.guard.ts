import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { ROLES_KEY } from './roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization || '';
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({ messgae: 'Пользователь не авторизован' });
    } else if (!token.includes('.')) {
      throw new HttpException('Не корректный токен!', HttpStatus.BAD_REQUEST)
    }

    const user = this.jwtService.verify(token);
    const matchRole = user.roles.some((role: { value: string }) => requiredRoles.includes(role.value));
    if (matchRole) {
      return true;
    } else {
      throw new HttpException('у вас нет доступа', HttpStatus.FORBIDDEN)
    }
  };
};
