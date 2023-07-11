import { BaseInterfaceRepository } from './base.interface.repository';
import { User } from '../entities/user.entity';

export type UserRepositoryInterface = BaseInterfaceRepository<User>;
