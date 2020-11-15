import { ActionReducerMap } from '@ngrx/store';
import { State } from './states';

import { reducer as userReducer } from './user/user.reducer';
import { reducer as usersReducer } from './users/users.reducer';

export const reducers: ActionReducerMap<State> = {
  userState: userReducer,
  userSet: usersReducer
};
