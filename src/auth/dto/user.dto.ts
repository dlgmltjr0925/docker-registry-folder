export class UserDto {
  id!: number;
  username!: string;
  role!: 'ADMIN' | 'MANAGER' | 'VIEWER';
  systemAdmin!: boolean;
}
