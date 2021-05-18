import {
    Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseFilters, UseGuards,
    UsePipes
} from '@nestjs/common';

import { Role } from '../auth/interfaces/role.enum';
import { Roles } from '../auth/roles.decorator';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';
import { DockerRegistryExceptionFilter } from '../docker-registry/docker-registry-exception.filter';
import { DockerRegistryService } from '../docker-registry/docker-registry.service';
import { CreateRegistryDto, CreateRegistrySchema } from './dto/create-registry.dto';
import { RegistryDto } from './dto/registry.dto';
import { UpdateRegistryDto, UpdateRegistrySchema } from './dto/update-registry.dto';
import { RegistryService } from './registry.service';

@Controller('api/registry')
@UseFilters(DockerRegistryExceptionFilter)
// @UseGuards(JwtAuthGuard)
export class RegistryController {
  constructor(private registryService: RegistryService, private dockerRegistryService: DockerRegistryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UsePipes(new JoiValidationPipe(CreateRegistrySchema))
  async create(@Body() createRegistryDto: CreateRegistryDto) {
    try {
      const { host, username, password } = createRegistryDto;
      await this.dockerRegistryService.checkApiVersion({ host, username, password, token: null });
      return await this.registryService.create(createRegistryDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('list')
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  async findAll(): Promise<RegistryDto[]> {
    const registries = await this.registryService.findAll();
    return await this.registryService.getRegistriesWithRepositories(registries);
  }

  @Get('list/:keyword*')
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  async findAllByKeyword(@Param() param: any) {
    const keyword = param.keyword + param[0];
    const registries = await this.registryService.findAllByKeyword(keyword);
    return await this.registryService.getRegistriesWithRepositories(registries);
  }

  @Get('test')
  test() {
    console.log('here');
    const plainText = 'hello world';
    const enc = this.registryService.encrypt(plainText);
    const dec = this.registryService.decrypt(enc);
    console.log('test', enc, dec);

    return {};
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.MANAGER, Role.VIEWER)
  findOne(@Param('id') id: string) {
    return this.registryService.findOne(+id);
  }

  @Put()
  @Roles(Role.ADMIN, Role.MANAGER)
  @UsePipes(new JoiValidationPipe(UpdateRegistrySchema))
  async update(@Body() updateRegistryDto: UpdateRegistryDto) {
    try {
      const { host, username, password } = updateRegistryDto;
      await this.dockerRegistryService.checkApiVersion({ host, username, password, token: null });
      return await this.registryService.update(updateRegistryDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.registryService.remove(+id);
  }
}
