import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';

import { UserDto } from '../auth/dto/user.dto';
import { Role } from '../auth/interfaces/role.enum';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

export interface CreateUserResponse {
  user: UserDto;
}

export interface UserListResponse {
  users: UserDto[];
}

@Controller('api/user')
@Roles(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.userService.create(createUserDto);
  }

  @Put()
  async update(@Body() updateUserDto: UpdateUserDto): Promise<boolean> {
    return await this.userService.update(updateUserDto);
  }

  @Get('list')
  async findAll(): Promise<UserListResponse> {
    return { users: await this.userService.findAll() };
  }

  @Get('list/:keyword*')
  async findAllByKeyword(@Param() param: any): Promise<UserListResponse> {
    const keyword = param.keyword + param[0];
    return { users: await this.userService.findAllByKeyword(keyword) };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @Delete(':ids')
  remove(@Param('ids') ids: string) {
    if (!/^\d+(?:,\d+)*$/.test(ids)) throw new BadRequestException('Invalid params');
    return this.userService.removeByIds(ids);
  }
}
