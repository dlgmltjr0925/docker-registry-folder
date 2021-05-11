import {
    Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes
} from '@nestjs/common';

import { UserDto } from '../auth/dto/user.dto';
import { Role } from '../auth/interfaces/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { CreateRegistryDto, CreateRegistrySchema } from './dto/create-registry.dto';
import { UpdateRegistryDto } from './dto/update-registry.dto';
import { RegistryService } from './registry.service';

@Controller('api/registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(CreateRegistrySchema))
  create(@Body() createRegistryDto: CreateRegistryDto) {
    return this.registryService.create(createRegistryDto);
  }

  @Get()
  findAll() {
    return this.registryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.registryService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRegistryDto: UpdateRegistryDto) {
    return this.registryService.update(+id, updateRegistryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.registryService.remove(+id);
  }
}
