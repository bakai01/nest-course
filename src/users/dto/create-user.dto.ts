import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Почта пользователя' })
  readonly email: string;

  @ApiProperty({ example: 'password', description: 'Пароль пользователя' })
  readonly password: string;
};
