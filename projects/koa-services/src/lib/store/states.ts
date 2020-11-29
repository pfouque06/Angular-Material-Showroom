import { UserState } from './user/user.state';
import { UserSet } from './users/users.state';

export interface State {
    userState: UserState;
    userSet: UserSet;
}
