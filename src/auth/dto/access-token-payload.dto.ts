import { Role } from '../interfaces/role.enum';

export class AccessTokenPayload {
  sub: number;
  username: string;
  role: Role;
  systemAdmin: boolean;

  constructor(id: number, username: string, role: Role, systemAdmin: boolean) {
    this.sub = id;
    this.username = username;
    this.role = role;
    this.systemAdmin = systemAdmin;
  }
}
