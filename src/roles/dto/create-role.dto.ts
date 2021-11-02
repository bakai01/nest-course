import { IsNumber, IsString } from "class-validator";

export class CreateRoleDto {
  @IsString({ message: 'Должно быть строкой' })
  readonly value: string;

  @IsNumber({}, { message: 'Должно быть числом' })
  readonly description: string;
};