import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { filter, skip, take } from 'rxjs/operators';
import { UserModalComponent } from 'src/app/shared/components/modals/user-modal/user-modal.component';
import { GlobalAlertComponent } from 'src/app/shared/components/snackbars/global-alert.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { State } from 'src/app/shared/store/states';
import { selectUserState } from 'src/app/shared/store/user/user.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input() public title: string;
  public connecting = false;
  public headerSnackBar: MatSnackBarRef<any>;

  public fullName$: Observable<string>;

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    public dialog: MatDialog,
    private snackBarService: MatSnackBar,
    private router: Router
  ) {
    // define observers
    this.fullName$ = this.authService.getCurrentUserFullName$();
  }

  public get isLogged() { return this.authService.isLogged; }

  public loginToggle() {
    // logout
    if (this.isLogged) {
      this.authService.logout();
      this.connecting = true;
      this.store.pipe( select(selectUserState), skip(1), take(1),
      ).subscribe(
        (state) => {
          this.connecting = false;
          if (!state.errors) {
            // reroute page if all is fine, this.router.url is route name
            if (this.router.url.match('^\/dashboard')) {
              this.router.navigate(['/home']);
              // delay navigation because of guard control too quick !!
              // setTimeout(()=>{ this.router.navigate(['/dashboard']); }, 500)
            }
          } else {
            this.fireSnackBar('Logout has failed! please check logs', 'snack-bar-error' );
          }
        }
      );
    } else { this.openUserFormDialog('login'); } // login
  }

  public profileToggle() {
    if (this.isLogged) { // view Profile
      const url = `dashboard/users/profile/`;
      this.router.navigate([url]);
    } else { // register
      this.openUserFormDialog('register');
    }
  }

  openUserFormDialog(formType: 'login' | 'register'): void {
    let userForm: any = { formType: formType, password: "secret"  };
    if (formType == "login")
    userForm = { ...userForm, email: "sam.va@gmail.com"};

    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '300px',
      data: userForm //data: {}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) return;
      userForm = result;
      switch (formType) {
        case 'register': {
          this.authService.register( userForm.email, userForm.password);
          this.store.pipe( select(selectUserState), skip(1), take(1), filter( s => !s.errors))
          .subscribe( _ => this.authService.fireSnackBar('Registering is succefull, you can now login with your credentials', 'snack-bar-success'));
          break;
        }
        case 'login': {
          this.connecting = true;
          this.authService.login( userForm.email, userForm.password);
          this.store.pipe( select(selectUserState), skip(1), take(1),
          ).subscribe(
            (state) => {
              this.connecting = false;
              if ( ! state.errors) {
                this.router.navigate(['/dashboard']);
                // delay navigation because of guard control too quick !!
                // setTimeout(()=>{ this.router.navigate(['/dashboard']); }, 500)
              } else {
                this.fireSnackBar('Login has failed! Please check your credentials', 'snack-bar-error' );
              }
            }
          );
          break;
        }
      }
    });
  }

  fireSnackBar(message: string, style: string ) {
    this.headerSnackBar =  this.snackBarService.openFromComponent(GlobalAlertComponent, {
      duration: 2000, // 2 secondds
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [style], // style
      data : message // provided message
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
