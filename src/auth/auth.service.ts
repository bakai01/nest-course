import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) { }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('Пользователь с такой почтой уже существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({ email: userDto.email, password: hashPassword });
    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload)
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    try {
      const user = await this.userService.getUserByEmail(userDto.email);
      if (!user) {
        throw new HttpException('Такого пользователя нет', HttpStatus.NOT_FOUND);
      }
      const passwordEquals = await bcrypt.compare(userDto.password, user.password);
      if (user && passwordEquals) {
        return user;
      }
    } catch (error) {
      // if (typeof error.message && error.message === "Cannot read property 'password' of null") {
      //   throw new HttpException('Такого пользователя нет', HttpStatus.NOT_FOUND);
      // }
      throw new UnauthorizedException({ message: 'Не коректный емаил или пароль' });
    }
  }
};
