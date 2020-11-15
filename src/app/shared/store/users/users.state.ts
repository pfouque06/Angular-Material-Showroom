import { EntityState } from '@ngrx/entity';
import { User } from '../../models/class/user';
import { Status } from '../core';

export interface UserSet  extends EntityState<User>{
  selectedUserId: number;
  status: Status;
  errors: any;
}
