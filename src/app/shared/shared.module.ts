import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfirmationModalComponent } from './components/modals/confirmation-modal/confirmation-modal.component';
import { PasswordChangeModalComponent } from './components/modals/password-change-modal/password-change-modal.component';
import { UserModalComponent } from './components/modals/user-modal/user-modal.component';
import { IsLoggedGuardAlertComponent } from './components/snackbars/is-logged-guard-alert/is-logged-guard-alert.component';

import { ProfileUserDetailsComponent } from './components/user/profile-user-details/profile-user-details.component';

const SHARED_MODALS = [
  UserModalComponent,
  ConfirmationModalComponent,
  PasswordChangeModalComponent,
  IsLoggedGuardAlertComponent,
]

const SHARED_ENTITIES = [
  ProfileUserDetailsComponent,
]

const REACTIVE_FORM_DIRECTIVES = [
  FormsModule,
  ReactiveFormsModule
]

const SHARED_MODULES = [
  FlexLayoutModule,
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
  MatFormFieldModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSnackBarModule,
]

const SHARED_PROVIDED_MODULES = [
  MatIconRegistry,
]

@NgModule({
  declarations: [
    ...SHARED_ENTITIES,
    ...SHARED_MODALS,
    PasswordChangeModalComponent,
    IsLoggedGuardAlertComponent,
  ],
  imports: [
    CommonModule,
    ...REACTIVE_FORM_DIRECTIVES,
    ...SHARED_MODULES,
  ],
  exports: [
    ...SHARED_ENTITIES,
    ...SHARED_MODULES,
  ],
  entryComponents: [
    ...SHARED_MODALS,
  ],
  providers: [
    ...SHARED_PROVIDED_MODULES,
  ]
})
export class SharedModule { }

export class MaterialModule {
	constructor(public matIconRegistry: MatIconRegistry) {
    matIconRegistry.registerFontClassAlias('fontawesome', 'fa');
	}
}
