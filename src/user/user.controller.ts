import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from '../common/pipes/joi-validation.pipe';

import { UserDto } from '../auth/dto/user.dto';
import { Role } from '../auth/interfaces/role.enum';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ValidationExceptionFilter } from '../common/pipes/validation-exception.filter';

export interface CreateUserResponse {
  user: UserDto;
}

export interface UserListResponse {
  users: UserDto[];
}

@Controller('api/user')
@Roles(Role.ADMIN)
@UseFilters(ValidationExceptionFilter)
export class UserController {
  logger = new Logger('UserController');
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(CreateUserSchema))
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw error;
    }
  }

  @Put()
  @UsePipes(new JoiValidationPipe(UpdateUserSchema))
  async update(@Body() updateUserDto: UpdateUserDto): Promise<boolean> {
    try {
      return await this.userService.update(updateUserDto);
    } catch (error) {
      throw error;
    }
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
