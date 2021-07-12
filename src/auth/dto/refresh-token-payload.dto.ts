import { Role } from '../interfaces/role.enum';

export class RefreshTokenPayload {
  iss!: string;
  aud!: number;
  iat!: number;
}
