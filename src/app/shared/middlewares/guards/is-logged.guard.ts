import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, TextOnlySnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { IsLoggedGuardAlertComponent } from '../../components/snackbars/is-logged-guard-alert/is-logged-guard-alert.component';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  currentSnackBar: MatSnackBarRef<any>;

  constructor(
    private authService: AuthService,
    private snackBarService: MatSnackBar,
    private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // throw new Error('Method not implemented.');
    if (!this.authService.isLogged()) {
      console.log('IsLoggedGuard: UNAUTHORIZED ACCESS');

      // alert('Accès refusé, Vous devez être connecté pour avoir accès à cette page !');

      // this.currentSnackBar =  this.snackBarService.open('UNAUTHORIZED ACCESS! Sign-in is required there!', '', {
      this.currentSnackBar =  this.snackBarService.openFromComponent(IsLoggedGuardAlertComponent, {
        duration: 2000, // 2 secondds
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        panelClass: ['snack-bar-error'], // style
      });

      setTimeout(()=>{ this.router.navigate(['/home']); }, 1000)
      // this.currentSnackBar.afterDismissed().subscribe(() => {
      //     this.router.navigate(['/home']);
      // });
      return false;
    }
    return true;
  }
}
