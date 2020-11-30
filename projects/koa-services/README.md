# KoaServices

This library is a api helper for my Koa backend server inclugind user models, api services, and rjx stores

## Installation 

Run `npm i koa-services` to install the module in your project.
Then include following lines in your app.module.ts file :

    import { StoreModule, MetaReducer, ActionReducer } from '@ngrx/store';
    import { StoreDevtoolsModule } from '@ngrx/store-devtools';
    import { EffectsModule } from '@ngrx/effects';
    import { 
      KoaServicesModule, 
      metaReducers, reducers, UserEffects, UsersEffects,
      serverAddress, serverProtocol, SERVER_ADDRESS, SERVER_PROTOCOL } from 'koa-services';
    
    @NgModule({
      (..)
      imports: [
        (..)
        StoreModule.forRoot(reducers, { metaReducers }),
        StoreDevtoolsModule.instrument({ logOnly: true, maxAge: false, name: 'Koa front app' }),
        EffectsModule.forRoot([UserEffects, UsersEffects]),
      ],
      providers: [
        { provide: SERVER_ADDRESS,  useValue: serverAddress},
        { provide: SERVER_PROTOCOL, useValue: serverProtocol}
      ]
      (..)
    export class AppModule { }

## Usage

n/a yet
