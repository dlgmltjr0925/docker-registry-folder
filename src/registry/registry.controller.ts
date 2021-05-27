import {
    BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UseFilters,
    UseGuards, UsePipes
} from '@nestjs/common';

import { JwtAuthGuard } from '../../src/auth/jwt-auth.guard';
import { Role } from '../auth/interfaces/role.enum';
import { Roles } from '../auth/roles.decorator';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { DockerRegistryExceptionFilter } from '../docker-registry/docker-registry-exception.filter';
import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { CreateRegistryDto, CreateRegistrySchema } from './dto/create-registry.dto';
import { RegistryDto } from './dto/registry.dto';
import { UpdateRegistryDto, UpdateRegistrySchema } from './dto/update-registry.dto';
import { RegistryExceptionFilter } from './registry-exception.filter';
import { RegistryService } from './registry.service';

export interface CreateRegistryResponse {
  registry: RegistryDto;
}

export interface RegistryListResponse {
  registries: RegistryDto[];
}

@Controller('api/registry')
@UseFilters(DockerRegistryExceptionFilter)
@UseFilters(RegistryExceptionFilter)
@UseGuards(JwtAuthGuard)
export class RegistryController {
  constructor(private registryService: RegistryService, private dockerRegistryService: DockerRegistryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UsePipes(new JoiValidationPipe(CreateRegistrySchema))
  async create(@Body() createRegistryDto: CreateRegistryDto): Promise<CreateRegistryResponse> {
    try {
      const { host, username, password } = createRegistryDto;
      await this.dockerRegistryService.checkApiVersion({ host, username, password, token: null });
      const registry = await this.registryService.create(createRegistryDto);
      return { registry };
    } catch (error) {
      throw error;
    }
  }

  @Get('list')
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  async findAll(): Promise<RegistryListResponse> {
    const registries = await this.registryService.findAll();
    return { registries: await this.registryService.getRegistriesWithRepositories(registries) };
  }

  @Get('list/:keyword*')
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  async findAllByKeyword(@Param() param: any): Promise<RegistryListResponse> {
    const keyword = param.keyword + param[0];
    const registries = await this.registryService.findAllByKeyword(keyword);
    return { registries: await this.registryService.getRegistriesWithRepositories(registries) };
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  findOne(@Param('id') id: string) {
    return this.registryService.findOneById(+id);
  }

  @Put()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UsePipes(new JoiValidationPipe(UpdateRegistrySchema))
  async update(@Body() updateRegistryDto: UpdateRegistryDto) {
    try {
      const { host, username, password } = updateRegistryDto;
      await this.dockerRegistryService.checkApiVersion({ host, username, password });
      return await this.registryService.update(updateRegistryDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':ids')
  @Roles(Role.ADMIN, Role.MANAGER)
  removeById(@Param('ids') ids: string) {
    if (!/^\d+(?:,\d+)*$/.test(ids)) throw new BadRequestException('Invalid params');
    return this.registryService.removeByIds(ids);
  }
}
