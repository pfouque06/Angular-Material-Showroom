import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  currentSnackBar: MatSnackBarRef<TextOnlySnackBar>;

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
      this.currentSnackBar =  this.snackBarService.open('UNAUTHORIZED ACCESS! Sign-in is required there!', '', {
        duration:2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
      this.currentSnackBar.afterDismissed().subscribe(() => {
        // console.log(this.router.url); //  current route
        // reroute to home if current url belongs to admin dashoard
        // if (this.router.url.match('^\/dashboard')) {
          // reroute to home page
          this.router.navigate(['/home']);
        // }
      });
      return false;
    }
    return true;
  }
}
