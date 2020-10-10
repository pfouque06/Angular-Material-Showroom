import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSliderModule} from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { UserModalComponent } from './modals/user-modal/user-modal.component';

const SHARED_ENTITIES = []

const SHARED_MODULES = [
  // FlexLayoutModule,
  MatSliderModule,
  MatCardModule,
  MatDividerModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatMenuModule,
  MatToolbarModule,
  MatDialogModule,
  FormsModule,
  MatInputModule,
  MatFormFieldModule
]

@NgModule({
  declarations: [
    ...SHARED_ENTITIES,
    UserModalComponent
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
