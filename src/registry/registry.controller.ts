import {
    Body, Controller, Delete, Get, Param, Patch, Post, Req, UseFilters, UseGuards, UsePipes
} from '@nestjs/common';

import { Role } from '../auth/interfaces/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { DockerRegistryExceptionFilter } from '../docker-registry/docker-registry-exception.filter';
import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { CreateRegistryDto, CreateRegistrySchema } from './dto/create-registry.dto';
import { UpdateRegistryDto } from './dto/update-registry.dto';
import { RegistryService } from './registry.service';

@Controller('api/registry')
@UseFilters(DockerRegistryExceptionFilter)
export class RegistryController {
  constructor(private registryService: RegistryService, private dockerRegistryService: DockerRegistryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new JoiValidationPipe(CreateRegistrySchema))
  async create(@Body() createRegistryDto: CreateRegistryDto) {
    try {
      const { host, username, password } = createRegistryDto;
      await this.dockerRegistryService.checkApiVersion({ host, username, password });
      return await this.registryService.create(createRegistryDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('list')
  findAll() {
    return this.registryService.findAll();
  }

  @Get('list/:keywords')
  findAllByKeyword() {
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
