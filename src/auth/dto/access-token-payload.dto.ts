import { Role } from '../interfaces/role.enum';

export class AccessTokenPayload {
  sub!: number;
  username!: string;
  role!: Role;
  systemAdmin!: boolean;
}
