import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { UserDto } from '../auth/dto/user.dto';
import { Role } from '../auth/interfaces/role.enum';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

export interface UserListResponse {
  users: UserDto[];
}

@Controller('user')
@Roles(Role.ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':ids')
  remove(@Param('ids') ids: string) {
    if (!/^\d+(?:,\d+)*$/.test(ids)) throw new BadRequestException('Invalid params');
    return this.userService.removeByIds(ids);
  }
}
