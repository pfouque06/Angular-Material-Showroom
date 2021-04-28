import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { User } from '../../models/class/user';
import { Status } from '../core';
import { UsersActions, UsersActionTypes } from './users.action';
import { UserSet } from './users.state';

// Build initial state
const adapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user: User) => user.id,
  sortComparer: false,
});
export const initialState: UserSet = adapter.getInitialState({
  selectedUserId: null,
  status: Status.Ready,
  errors: null
});

export const pendingState: UserSet = adapter.getInitialState({
  ...initialState,
  status: Status.Pending,
});

export function reducer(state = initialState, action: UsersActions): UserSet {

  switch (action.type) {

    case UsersActionTypes.GetAll:
    case UsersActionTypes.Reset: {
      // console.log(`${action.type}.Reducer().Pending ...`);
      return { ...pendingState };
    }

    case UsersActionTypes.Create: {
      // console.log(`${action.type}.Reducer().Pending ...`);
      return adapter.upsertMany(action.payload, pendingState);
    }

    case UsersActionTypes.GetById:
    case UsersActionTypes.DeleteById: {
      // console.log(`${action.type}.Reducer().Pending ...`);
      return { ...pendingState, selectedUserId: action.payload.id };
    }

    case UsersActionTypes.UpdateById: {
      // console.log(`${action.type}.Reducer().Pending ...`);
      return adapter.upsertMany(action.payload.users, { ...pendingState, selectedUserId: action.payload.id});
    }

    case UsersActionTypes.Set: {
      // console.log(`${action.type}.Reducer().Ready ...`);
      return adapter.upsertMany(action.payload, initialState);
    }

    case UsersActionTypes.Ready: {
      // console.log(`${action.type}.Reducer().Ready ...`);
      return { ...state, status: Status.Ready, };
    }

    case UsersActionTypes.Clear: {
      // console.log(`${action.type}.Reducer().Ready ...`);
      return { ...initialState };
    }

    case UsersActionTypes.Fail: {
      // console.log(`${action.type}.Reducer().Ready ...`);
      return { ...state, status: Status.Ready, errors: action.payload };
    }

    default: { return state; }

  }
}

export const getSelectedUserId = (state: UserSet) => state.selectedUserId;

export const {
  // select the array of user ids
  selectIds: selectedUserIds,

  // select the dictionary of user entities
  selectEntities: selectUserEntities,

  // select the array of users
  selectAll: selectAllUsers,

  // select the total user count
  selectTotal: selectUserTotal,
} = adapter.getSelectors();
