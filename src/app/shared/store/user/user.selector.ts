import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUser = createSelector(
    selectUserState,
    (s) => s.user
);

export const selectUserToken = createSelector(
    selectUserState,
    (s) => s.token
);

export const selectUserStatus = createSelector(
    selectUserState,
    (s) => s.status
);
