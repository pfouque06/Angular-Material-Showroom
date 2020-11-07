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
      return {
        ...initialState,
        // user: { ...initialState.user, email: action.payload.email },
        user: { email: action.payload.email },
        status: Status.Pending
      };
    }

    case UserActionTypes.Update:
    case UserActionTypes.Delete: {
      return {
        ...state,
        status: Status.Pending,
      };
    }

    case UserActionTypes.Clear: {
      return { ...initialState };
    }

    case UserActionTypes.Set: {
      return {
        ...initialState,
        user: action.payload.user,
        token: action.payload.token || state.token,
        status: Status.Ready
      };
    }

    case UserActionTypes.Fail: {
      console.log('UserActionTypes.Fail', action.payload);
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
