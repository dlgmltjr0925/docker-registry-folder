import {
    Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseFilters, UseGuards, UsePipes
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
@UseGuards(JwtAuthGuard)
export class RegistryController {
  constructor(private registryService: RegistryService, private dockerRegistryService: DockerRegistryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
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
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  findAll() {
    return this.registryService.findAll();
  }

  @Get('list/:keyword*')
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  findAllByKeyword(@Param() param: any) {
    const keyword = param.keyword + param[0];
    return this.registryService.findAllByKeyword(keyword);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  findOne(@Param('id') id: string) {
    return this.registryService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  update(@Param('id') id: string, @Body() updateRegistryDto: UpdateRegistryDto) {
    return this.registryService.update(+id, updateRegistryDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.registryService.remove(+id);
  }
}
