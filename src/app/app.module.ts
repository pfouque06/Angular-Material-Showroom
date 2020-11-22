import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

import { StoreModule, MetaReducer, ActionReducer } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';
import { EffectsModule } from '@ngrx/effects';
import { State } from './shared/store/states';
import { reducers } from './shared/store/reducers';
import { UserEffects } from './shared/store/user/user.effect';
import { UsersEffects } from './shared/store/users/users.effect';
// import { IonicLoaderComponent } from 'ionic-loader/lib/ionic-loader.component';
// import { IonicLoaderModule } from 'ionic-loader';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['userState', 'userSet'], rehydrate: true, restoreDates: false})(reducer);
}

const metaReducers: Array<MetaReducer<State>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    // IonicLoaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      logOnly: true,
      maxAge: false,
      name: 'Koa front app',
    }),
    EffectsModule.forRoot([UserEffects, UsersEffects]),
    // IonicLoaderModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
  ]
})
export class AppModule { }
