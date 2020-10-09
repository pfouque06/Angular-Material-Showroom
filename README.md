install material for angular :
npm i @angular/cdk @angular/forms @angular/material

add in src/app.module.ts :
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
…
@NgModule ({....
  imports: [...,
  MatSliderModule,
  MatCardModule,
  MatDividerModule,
  MatButtonModule,
  MatIconModule
…]
})

npm update
npm cache verify
npm cache clear --force
npm install ??

add in src/index.html/head section :
<title>Angular Material Showroom</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

add in src/stylesheet.css :
@import '~@angular/material/prebuilt-themes/indigo-pink.css';

inject in src/app.component.html :
export class AppComponent {
  title = 'Angular Material Showroom';
}

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
