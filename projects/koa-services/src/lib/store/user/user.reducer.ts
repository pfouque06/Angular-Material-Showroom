import { Status } from '../core';
import { UserActions, UserActionTypes } from './user.action';
import { UserState } from './user.state';

const initialState: UserState = {
  // user: null,
  user: {},
  token: '',
  status: Status.Ready,
  errors: null
};

export function reducer(state = initialState, action: UserActions): UserState {

  switch (action.type) {

    case UserActionTypes.Register:
    case UserActionTypes.Login: {
      // console.log(`${action.type}.Reducer().Pending ...`);
      return {
        ...initialState,
        user: { email: action.payload.email },
        status: Status.Pending
      };
    }

    case UserActionTypes.Logout:
    case UserActionTypes.Myself:
    case UserActionTypes.Update:
    case UserActionTypes.ChangePassword:
    case UserActionTypes.Reset:
    case UserActionTypes.Delete: {
      // console.log(`${action.type}.Reducer().Pending ...`);
      return {
        ...state,
        status: Status.Pending,
        errors: null,
      };
    }

    case UserActionTypes.Set: {
      // console.log(`${action.type}.Reducer().Ready ...`);
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.token || state.token,
        status: Status.Ready
      };
    }

    case UserActionTypes.Ready: {
      // console.log(`${action.type}.Reducer().Ready ...`);
      return {
        ...state,
        status: Status.Ready,
      };
    }

    case UserActionTypes.Clear: {
      // console.log(`${action.type}.Reducer().Ready ...`);
      return { ...initialState };
    }

    case UserActionTypes.Fail: {
      // console.log(`${action.type}.Reducer().Ready ...`);
      return {
        ...state,
        status: Status.Ready,
        errors: action.payload
      };
    }

    default: {
      return state;
    }

  }
}
