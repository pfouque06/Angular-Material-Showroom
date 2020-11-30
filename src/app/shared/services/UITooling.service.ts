import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GlobalAlertComponent } from '../components/snackbars/global-alert.component';
import { IsLoggedGuardAlertComponent } from '../components/snackbars/is-logged-guard-alert.component';


@Injectable({ providedIn: 'root' })
export class UItoolingService {

  public authSnackBar: MatSnackBarRef<any>;

  constructor(private snackBarService: MatSnackBar, public dialog: MatDialog, private router: Router) {
  }

  public fireGlobalAlertSnackBar(message: string, style: string) {
    this.authSnackBar = this.snackBarService.openFromComponent(GlobalAlertComponent, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [style],
      data: message // provided message
    });
  }

  public fireLoggedGuardAlertSnackBar() {
    this.authSnackBar =  this.snackBarService.openFromComponent(IsLoggedGuardAlertComponent, {
      duration: 2000, // 2 seconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['snack-bar-error'], // style
    });
  }

  public fireDialog<T, D = any, R = any>(component: ComponentType<T>, config?: MatDialogConfig<D>): MatDialogRef<T, R> {
    return this.dialog.open(component, config);
  }
}
