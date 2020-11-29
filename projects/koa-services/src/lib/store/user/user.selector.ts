import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('userState');

export const selectUser = createSelector(
    selectUserState,
    (s) => s.user
);

export const selectUserProfile = createSelector(
    selectUserState,
    (s) => s.user.profile
);

export const selectUserToken = createSelector(
    selectUserState,
    (s) => s.token
);

export const selectUserStatus = createSelector(
    selectUserState,
    (s) => s.status
);
