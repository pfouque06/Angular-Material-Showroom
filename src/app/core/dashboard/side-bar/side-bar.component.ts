import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/components/modals/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  public loading: boolean = true;
  public profileType: string = ''
  public fullName: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router ) { }

  ngOnInit() {
    this.authService.getCurrentUser().then ( (user) => this.profileType = user.profile);
    this.authService.getCurrentUserFullName().then( (fn) => this.fullName = fn);
    this.loading = false;
  }

  public isAdmin(): boolean {
    return ( this.profileType == "admin" );
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
            if (await this.authService.reset()) { this.reloadCurrentRoute("dashboard"); }
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
