import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHttpInterceptorInterceptor } from './shared/middlewares/interceptors/jwt-http-interceptor.interceptor';

import { StoreModule, MetaReducer, ActionReducer } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { EffectsModule } from '@ngrx/effects';
import { State } from './shared/store/states';
import { reducers } from './shared/store/reducers';
import { UserEffects } from './shared/store/user/user.effect';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['user'], rehydrate: true, restoreDates: false})(reducer);
}

const metaReducers: Array<MetaReducer<State>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule, // Requit pour injecter la D.I. HttpClient qui nous permettra de requêter un serveur distant
    SharedModule,
    CoreModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      logOnly: true,
      maxAge: false,
      name: 'Koa front app',
    }),
    EffectsModule.forRoot([UserEffects]),
  ],
  providers: [
    // Mise en place d'un intercepteur qui permettra d'appliquer le token automatiquement
    // à chaque requête sortante de notre application Angular
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
  ]
})
export class AppModule { }
