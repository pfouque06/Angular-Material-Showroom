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
