export class JwtPayload {
  sub!: number;
  username!: string;
  role!: 'ADMIN' | 'MANAGER' | 'VIEWER';
  systemAdmin!: boolean;
}
