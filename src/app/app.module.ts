import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHttpInteceptorInterceptor } from './shared/interceptors/jwt-http-inteceptor.interceptor';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CoreModule
  ],
  providers: [
    // Mise en place d'un intercepteur qui permettra d'appliquer le token automatiquement
    // à chaque requête sortante de notre application Angular
    { provide: HTTP_INTERCEPTORS, useClass: JwtHttpInteceptorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
