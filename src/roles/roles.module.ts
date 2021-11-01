import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './roles.model';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([Role])
  ]
})
export class RolesModule {}
