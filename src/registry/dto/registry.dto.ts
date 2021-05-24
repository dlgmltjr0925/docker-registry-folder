import { RepositoryDto } from './repository.dto';

export class RegistryDto {
  id!: number;
  name!: string;
  host!: string;
  tag!: string;
  repositories!: RepositoryDto[];
  message!: string;
  status: 'UP' | 'DOWN';
  checkedAt!: Date;
}
