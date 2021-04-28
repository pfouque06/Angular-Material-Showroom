import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHttpInterceptorInterceptor } from './middlewares/interceptors/jwt-http-interceptor.interceptor';
// helper to bind associated backend according to url (prod/dev)
import { serverAddress, serverProtocol, SERVER_ADDRESS, SERVER_PROTOCOL } from './services/api-helper.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { State } from './store/states';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['userState', 'userSet'], rehydrate: true, restoreDates: false})(reducer);
}

export const metaReducers: Array<MetaReducer<State>> = [localStorageSyncReducer];

const SHARED_MODULES = [
  HttpClientModule,  // Requit pour injecter la D.I. HttpClient qui nous permettra de requêter un serveur distant
]

@NgModule({
  declarations: [],
  imports: [
    SHARED_MODULES,
  ],
  exports: [
    SHARED_MODULES,
  ],
  providers: [
    AuthService,
    UserService,
    // intercepteur pour appliquer le token automatiquement à chaque requête sortante
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptorInterceptor, multi: true },
    { provide: SERVER_ADDRESS,  useValue: serverAddress},
    { provide: SERVER_PROTOCOL, useValue: serverProtocol},
  ],
})
export class KoaServicesModule { }
