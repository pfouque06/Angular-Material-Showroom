import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  public loading: boolean = true;
  public fullName: string = "";

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router ) { }

  ngOnInit() {
    console.log("SideBarComponent.ngOnInit()");

    this.fullName = this.authService.getCurrentUserFullName();
    console.log('fullName: ' + this.fullName);
    this.loading = false;
  }

  public isAdmin(): boolean {
    return (this.authService.getCurrentUser().profile == "admin");
  }

  public usersReset() {
    this.openAdminConfirmationDialog('usersReset');
  }

  public authReset() {
    this.openAdminConfirmationDialog('authReset');
  }

  openAdminConfirmationDialog(formType: 'usersReset' | 'authReset') {
    let userForm: any = { formType: formType, password: "secret"  };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '500px',
      //data: {}
      data: userForm
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (! result) return;
      const confirmFeedback = result;
      if (confirmFeedback.confirmed) {
        switch (confirmFeedback.formType) {
          case 'usersReset': {
            await this.userService.reset();
            break;
          }
          case 'authReset': {
            if (await this.authService.reset()) {
              // reroute page if all is fine
              console.log(this.router.url); //  /routename
              if (this.router.url.match('^\/dashboard')) {
                this.router.navigate(['/home']);
              }
            }
            break;
          }
        }
      }
    });
  }
}
