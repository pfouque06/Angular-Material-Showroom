import { Action } from '@ngrx/store';
import { User } from '../../models/class/user';

export enum UsersActionTypes {
  GetAll = '[Users] GetAll',
  GetById = '[Users] GetById',
  Create = '[Users] Create',
  UpdateById = '[Users] UpdateById',
  DeleteById = '[Users] DeleteById',
  Reset = '[Users] Reset',
  Set = '[Users] Set',
  Ready = '[Users] Ready',
  Clear = '[Users] Clear',
  Fail = '[Users] Fail',
}

export type UsersActions =
  | GetAll
  | GetById
  | Create
  | UpdateById
  | DeleteById
  | Reset
  | Set
  | Clear
  | Ready
  | Fail;

export class GetAll implements Action {
    public readonly type = UsersActionTypes.GetAll;
    constructor() {}
}

export class GetById implements Action {
    public readonly type = UsersActionTypes.GetById;
    constructor(public payload: {id: number}) {}
  }

export class Create implements Action {
  public readonly type = UsersActionTypes.Create;
  constructor(public payload: User[]) {}
}

export class UpdateById implements Action {
  public readonly type = UsersActionTypes.UpdateById;
  constructor(public payload: {id: number, users: User[]}) {}
}

export class DeleteById implements Action {
  public readonly type = UsersActionTypes.DeleteById;
  constructor(public payload: {id: number}) {}
}

export class Reset implements Action {
    public readonly type = UsersActionTypes.Reset;
}

export class Set implements Action {
  public readonly type = UsersActionTypes.Set;
  constructor(public payload: User[]) {}
}

export class Clear implements Action {
    public readonly type = UsersActionTypes.Clear;
}

export class Ready implements Action {
    public readonly type = UsersActionTypes.Ready;
}

export class Fail implements Action {
    public readonly type = UsersActionTypes.Fail;
    constructor(public payload?: any) {}
}
