import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, TextOnlySnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { IsLoggedGuardAlertComponent } from '../../components/snackbars/is-logged-guard-alert/is-logged-guard-alert.component';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivateChild {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  currentSnackBar: MatSnackBarRef<any>;

  constructor(
    private authService: AuthService,
    private snackBarService: MatSnackBar,
    private router: Router) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // if (! this.authService.isLogged()) {
    return this.authService.isLogged().then ( (isLogged) => {
      if (!isLogged) {
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
        return false;
      }
      return true;
    });
  }
}
