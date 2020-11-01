# How to make basic angular/material project:

## Install
ng new project_name --skipTests=true --routing=true --style=css
cd project_name

add in src/index.html/head section for window/tab title:
<title>Angular Material Showroom</title>

inject in src/app.component.html :
export class AppComponent {  
  title = 'Angular Material Showroom';  
}  

# Imports

install material for angular :
> $ npm i @angular/compile @angular/cdk @angular/forms @angular/material@angular/flex-layout @angular/platform-browser @angular/platform-browser-dynamic

add in src/app.module.ts :
import { FlexLayoutModule } from '@angular/flex-layout';  
import { MatSliderModule } from '@angular/material/slider';  
import { MatCardModule } from '@angular/material/card';  
import { MatDividerModule } from '@angular/material/divider';  
import { MatButtonModule } from '@angular/material/button';  
import { MatIconModule } from '@angular/material/icon';  
…
@NgModule ({....  
  imports: [...,
  FlexLayoutModule  
  MatSliderModule,  
  MatCardModule,  
  MatDividerModule,  
  MatButtonModule,  
  MatIconModule  
…]  
})  

> $ npm update  
> $ npm cache verify  
> $ npm cache clear --force  
> $ npm install  

add in src/index.html/head section :
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">  

add in src/stylesheet.css :
@import '~@angular/material/prebuilt-themes/indigo-pink.css';  

inject in src/app.component.html :
<div class="mat-app-background basic-container">  
  <!-- <hr> -->  
  <mat-divider></mat-divider>  
  <h2>{{ title }}</h2>  
  <h4>Angular works ! </h4>  
  <mat-divider></mat-divider>  
  <!-- <mat-slider min="1" max="100" step="1" value="1">material is loaded !</mat-slider> -->  
  <mat-card>  
    <mat-card-header>  
      <mat-card-title><code>@angular/material</code></mat-card-title>  
      <mat-card-subtitle>Material for Angular</mat-card-subtitle>  
    </mat-card-header>  
    <mat-card-content>  
      <code>@angular/material</code> seems to be installed and operational as well !!  
    </mat-card-content>  
    <mat-card-actions>  
      <button mat-icon-button aria-label="Share"><mat-icon>share</mat-icon></button>  
      <button mat-icon-button aria-label="Like" color="primary"><mat-icon>thumb_up</mat-icon></button>  
      <button mat-icon-button aria-label="Love" color="warn"><mat-icon>favorite</mat-icon></button>  
    </mat-card-actions>  
  </mat-card>  
  <mat-divider></mat-divider>  
  <!-- <p><code>Fontawesome</code> works also !! <fa-icon icon="check"></fa-icon> ...<fa-icon icon="coffee"></fa-icon></p> -->  
  <router-outlet></router-outlet>  
</div>  


## Foundations
> $ ng g module shared --module=app  
> $ ng g module core --module=app --routing --route="**"  

Please note that «core works!» mention appears at the bottom of the display. This is due to <router-outlet></router-outlet> instruction which injects core component. 

Move Tierce Modules to shared module : Update app/shared/shared.module.ts file : 
import { NgModule } from '@angular/core';  
import { CommonModule } from '@angular/common';  

import { MatSliderModule } from '@angular/material/slider';  
import { MatCardModule } from '@angular/material/card';  
import { MatDividerModule } from '@angular/material/divider';  
import { MatButtonModule } from '@angular/material/button';  
import { MatIconModule } from '@angular/material/icon';  
import { MatTooltipModule } from '@angular/material/tooltip';  

const SHARED_ENTITIES = []  

const SHARED_MODULES = [  
  MatSliderModule,  
  MatCardModule,  
  MatDividerModule,  
  MatButtonModule,  
  MatIconModule,  
  MatTooltipModule,  
]  

@NgModule({  
  declarations: [  
    ...SHARED_ENTITIES  
  ],  
  imports: [  
    CommonModule,  
    ...SHARED_MODULES,  
  ],  
  exports: [  
    ...SHARED_MODULES  
  ]  
})  
export class SharedModule { }  

update src/app.module.ts :  
import { SharedModule } from './shared/shared.module';  
import { CoreModule } from './core/core.module';  

@NgModule({  
  declarations: [  
    AppComponent  
  ],  
  imports: [  
    BrowserModule,  
    AppRoutingModule,  
    SharedModule,  
    CoreModule  
  ],  
  providers: [],  
  bootstrap: [AppComponent]  
})  
export class AppModule { }  


## Starters

Generate header & footer components :
> $ ng g c core/header --module=app --skipTests=true  
> $ ng g c core/footer --module=app --skipTests=true  

Generate home component 
> $ ng g c core/home --module=core --skipTests=true  

Update app.component.html:

	  <app-header [title]="title"></app-header>  
    (..previous code..)  
	  <router-outlet></router-outlet>  
	  <app-footer></app-footer>  

Inject in core/header/header.component.ts :

	  import { Component, OnInit, Input } from "@angular/core";  
	  (..)  
	  export class HeaderComponent implements OnInit {  
	 
	    @Input() public title: string;  
	    public isNavbarCollapsed: boolean =true;  
	  (..)  

update core/header/header.compoenent.html :
<header fxLayout="row" fxLayoutAlign="start center">  
    <p>{{ title }} - header works!</p>  
</header>  

update core/footer/footer.compoenent.html :
<footer fxLayout="row" fxLayoutAlign="start center">  
  Your footer  
</footer>  

## custom

Create other project components
According to your needs along your application design, those are just some instances to demo the prupose :

	  > $ ng g c core/sandbox --module=core --skipTests=true  
	  > $ ng g c core/themes/spinner --module=core --skipTests=true  
    > $ ng g module core/dashboard --module=core --routing --route="**"  

Update core/core-routing.module.ts:

	  (.. import missing components according to above routes ..)  
	  const routes: Routes = [  
	  { path: '', redirectTo: 'home', pathMatch: 'full' },  
	  { path: 'home', component: HomeComponent },  
	  { path: 'sandbox', component: SandboxComponent },  
	  { path: 'themes/spinner ', component: SpinnerComponent },  
	  { path: 'dashboard', component: dashboardComponent },  
	  { path: '**', component: HomeComponent },  
	  ];

restful api helper and auth services
    > $ ng g service shared/services/api-helper --skipTests=true  
    > $ ng g service shared/services/auth --skipTests=true  
    > $ ng g interceptor shared/interceptors/jwt-http-inteceptor --skipTests=true  

user interface, class and service
    > $ ng g interface shared/models/interface/user  
    > $ ng g class shared/models/class/user  
    > $ ng g service shared/services/user --skipTests=true  

later ...
	  > $ ng g c core/dashboard/sideBar --module=dashboard --skipTests=true  
	  > $ ng g c core/dashboard/userList --module=dashboard --skipTests=true  
	  > $ ng g c core/dashboard/userForm --module=dashboard --skipTests=true  

# Deployment

### Common
> $ git clone git@github.com:pfouque06/Angular-Material-Showroom.git  
> $ cd Angular-Material-Showroom  

### Dev
> $ npm install  
> $ npm run start  
or 
> $ ng serve  

### Prod
> $ npm install  
> $ ng build --prod  
> $ cd dist/angular-material-sandbox01  
front is avialble there !!!
