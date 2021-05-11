import { Role } from '../interfaces/role.enum';

export class UserDto {
  id!: number;
  username!: string;
  role!: Role;
  systemAdmin!: boolean;
}
