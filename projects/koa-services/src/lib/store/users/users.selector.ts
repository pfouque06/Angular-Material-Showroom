import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserSet } from './users.state';
import * as fromSession from './users.reducer';

export const selectUserSetState = createFeatureSelector<UserSet>('userSet');

export const selectUserSetStatus = createSelector(
  selectUserSetState,
    (s) => s.status
);

export const selectUserIds = createSelector(
  selectUserSetState,
  fromSession.selectedUserIds,
);
export const selectUserEntities = createSelector(
  selectUserSetState,
  fromSession.selectUserEntities,
);
export const selectAllUsers = createSelector(
  selectUserSetState,
  fromSession.selectAllUsers,
);
export const selectUserTotal = createSelector(
  selectUserSetState,
  fromSession.selectUserTotal,
);
export const selectCurrentUserId = createSelector(
  selectUserSetState,
  fromSession.getselectedUserId,
);

export const selectCurrentUser= createSelector(
  selectUserEntities,
  selectCurrentUserId,
  (userEntities, userId) => userEntities[userId]
);

export const selectMostRecentUser = createSelector(
  selectAllUsers,
  (userEntities) => userEntities[0]
);

export const selectOtherRecentUsers = createSelector(
  selectAllUsers,
  (userEntities) => userEntities.slice(1, 6)
);
