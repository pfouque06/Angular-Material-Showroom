import { User } from '../../models/class/user';
import { Status } from '../core';

export interface UserState {
  // user: User;
  user: Partial<User>;
  token: string;
  status: Status;
  errors: any;
}
