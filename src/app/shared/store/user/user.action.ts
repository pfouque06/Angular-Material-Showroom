import { Action } from '@ngrx/store';
import { User } from '../../models/class/user';

export enum UserActionTypes {
  Register = '[User] Register',
  Login = '[User] Login',
  Logout = '[User] Logout',
  Myself = '[User] Myself',
  Update = '[User] Update',
  Delete = '[User] Delete',
  Set = '[User] Set',
  Clear = '[User] Clear',
  Fail = '[User] Fail',
};

export type UserActions =
  | Register
  | Login
  | Logout
  | Myself
  | Update
  | Delete
  | Set
  | Clear
  | Fail;

export class Register implements Action {
    public readonly type = UserActionTypes.Register;
    constructor(public payload: {email: string, password: string}) {}
}

export class Login implements Action {
    public readonly type = UserActionTypes.Login;
    constructor(public payload: {email: string, password: string}) {}
}

export class Logout implements Action {
    public readonly type = UserActionTypes.Logout;
    constructor() {}
}

export class Myself implements Action {
    public readonly type = UserActionTypes.Myself;
    constructor() {}
}

export class Set implements Action {
    public readonly type = UserActionTypes.Set;
    constructor(public payload: {user: User, token?: string}) {}
}

export class Update implements Action {
    public readonly type = UserActionTypes.Update;
    constructor(public payload: User) {}
}

export class Delete implements Action {
    public readonly type = UserActionTypes.Delete;
}

export class Clear implements Action {
    public readonly type = UserActionTypes.Clear;
}

export class Fail implements Action {
    public readonly type = UserActionTypes.Fail;
    constructor(public payload?: any) {}
}
