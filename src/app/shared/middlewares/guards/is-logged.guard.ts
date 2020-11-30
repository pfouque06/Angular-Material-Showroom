import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'koa-services';
import { UItoolingService } from '../../services/UITooling.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivateChild {

  constructor(
    private authService: AuthService,
    private UITooling: UItoolingService,
    private router: Router ) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if ( !this.authService.isLogged) {
      console.log('IsLoggedGuard: UNAUTHORIZED ACCESS');
      // alert('Accès refusé, Vous devez être connecté pour avoir accès à cette page !');
      // this.currentSnackBar =  this.snackBarService.open('UNAUTHORIZED ACCESS! Sign-in is required there!', '', {
      this.UITooling.fireLoggedGuardAlertSnackBar();
      setTimeout(()=>{ this.router.navigate(['/home']); }, 1000)
      return false;
    }
    return true;
  }
}
