import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService, selectAllUsers, selectUserSetState, selectUserState, State, UserService } from 'koa-services';
import { Observable } from 'rxjs';
import { filter, skip, take } from 'rxjs/operators';
import { ConfirmationModalComponent } from 'src/app/shared/components/modals/confirmation-modal/confirmation-modal.component';
import { UItoolingService } from 'src/app/shared/services/UITooling.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  public loading: boolean = true;
  public profileType$: Observable<string>;
  public fullName$: Observable<string>;

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private userService: UserService,
    private UITooling: UItoolingService,
    private router: Router ) { }

  ngOnInit() {
    // define observers
    this.profileType$ = this.authService.getCurrentUserProfileType$();
    this.fullName$ = this.authService.getCurrentUserFullName$();
    this.loading = false;
  }

  public usersReset() {
    this.openAdminConfirmationDialog('usersReset');
  }

  public authReset() {
    this.openAdminConfirmationDialog('authReset');
  }

  openAdminConfirmationDialog(formType: 'usersReset' | 'authReset') {
    // call dialog
    const dialogRef = this.UITooling.fireDialog(ConfirmationModalComponent, { width: '500px', data: { formType: formType } });

    // wait dialog close event
    dialogRef.afterClosed().subscribe(async result => {
      if (! result) return;
      const confirmFeedback = result;
      if (confirmFeedback.confirmed) {
        switch (confirmFeedback.formType) {
          case 'usersReset': {
            // if (await this.userService.reset()) { this.reloadCurrentRoute(); }
            this.userService.reset();
            // handle error
            this.store.pipe( select(selectUserSetState), skip(1), take(1))
            .subscribe( (state) => {
              if (!!state.errors && state.errors.error) {
                this.UITooling.fireGlobalAlertSnackBar('[Reset] Operation has failed! Please check logs and retry', 'snack-bar-error' );
              } else {
                this.UITooling.fireGlobalAlertSnackBar('Users Reset is succefull', 'snack-bar-success');
                this.reloadCurrentRoute();
              }
            });
            this.store.pipe( select(selectAllUsers), skip(1), take(1) )
            .subscribe( _ => {
            });
            break;
          }
          case 'authReset': {
            this.authService.reset();
            this.store.pipe( select(selectUserState), skip(1), take(1), filter( s => !s.errors))
            .subscribe( _ => {
              this.UITooling.fireGlobalAlertSnackBar('Session Reset is succefull', 'snack-bar-success');
              this.reloadCurrentRoute("dashboard");
            });
            break;
          }
        }
      }
    });
  }

  reloadCurrentRoute(exceptIfMatch?: string ) {
    let currentUrl = this.router.url; //  route name
    // console.log(currentUrl);
    if (this.router.url.match(`^\/${exceptIfMatch}`)) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([currentUrl]);
      });
    }
  }
}
