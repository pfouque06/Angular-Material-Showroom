import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, skip, take } from 'rxjs/operators';
import { ConfirmationModalComponent } from 'src/app/shared/components/modals/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { State } from 'src/app/shared/store/states';
import { selectUserState } from 'src/app/shared/store/user/user.selector';

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
    public dialog: MatDialog,
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
    const dialogRef = this.dialog.open(ConfirmationModalComponent, { width: '500px', data: { formType: formType } });

    // wait dialog close event
    dialogRef.afterClosed().subscribe(async result => {
      if (! result) return;
      const confirmFeedback = result;
      if (confirmFeedback.confirmed) {
        switch (confirmFeedback.formType) {
          case 'usersReset': {
            if (await this.userService.reset()) { this.reloadCurrentRoute(); }
            break;
          }
          case 'authReset': {
            this.authService.reset();
            this.store.pipe( select(selectUserState), skip(1), take(1), filter( s => !s.errors))
            .subscribe( _ => {
              this.authService.fireSnackBar('Reset is succefull', 'snack-bar-success');
              this.reloadCurrentRoute("dashboard");
            });
            break;
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
