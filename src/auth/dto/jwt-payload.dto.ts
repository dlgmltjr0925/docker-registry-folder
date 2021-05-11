import { Role } from '../interfaces/role.enum';

export class JwtPayload {
  sub!: number;
  username!: string;
  role!: Role;
  systemAdmin!: boolean;
}
