import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducer, MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { serverAddress, serverProtocol, SERVER_ADDRESS, SERVER_PROTOCOL } from './services/api-helper.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { reducers } from './store/reducers';
import { State } from './store/states';
import { UserEffects } from './store/user/user.effect';
import { UsersEffects } from './store/users/users.effect';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['userState', 'userSet'], rehydrate: true, restoreDates: false})(reducer);
}

const metaReducers: Array<MetaReducer<State>> = [localStorageSyncReducer];

@NgModule({
  declarations: [],
  imports: [    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      logOnly: true,
      maxAge: false,
      name: 'Koa front app',
    }),
    EffectsModule.forRoot([UserEffects, UsersEffects]),],
  providers: [
    AuthService,
    UserService,
    { provide: SERVER_ADDRESS,  useValue: serverAddress},
    { provide: SERVER_PROTOCOL, useValue: serverProtocol},
  ],
  exports: []
})
export class KoaServicesModule { }
