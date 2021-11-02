import { Body, Controller, Get, Param, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получение конкретного пользователя' })
  @ApiResponse({ status: 200, type: User })
  @Get(':id')
  getOne(@Param() params: { id: number }) {
    return this.usersService.getOneUser(params.id);
  }

  @ApiOperation({ summary: 'Выдача ролей' })
  @ApiResponse({ status: 200 })
  @Post('/role')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }

  @ApiOperation({ summary: 'Заблакировать пользователя' })
  @ApiResponse({ status: 200 })
  @Post('/ban')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  banUser(@Body() dto: BanUserDto) {
    return this.usersService.ban(dto);
  }
}
