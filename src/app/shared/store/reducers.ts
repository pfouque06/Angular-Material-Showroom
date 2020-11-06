import { ActionReducerMap } from '@ngrx/store';
import { State } from './states';

import { reducer as userReducer } from './user/user.reducer';

export const reducers: ActionReducerMap<State> = {
  user: userReducer,
};
