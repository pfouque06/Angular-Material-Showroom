import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserModalComponent } from 'src/app/shared/modals/user-modal/user-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() public title: string;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router ) { }

    ngOnInit(): void {
    }

    public ping(): boolean {
      return this.authService.pong;
    }

    public async loginToggle() {
      if (this.isLogged()) { // logout
        if (await this.authService.logout()) {
        // reroute page if all is fine
        console.log(this.router.url); //  /routename
        if (this.router.url.match('^\/dashboard')) {
          this.router.navigate(['/home']);
        }
      }
    } else { // login
      this.openUserFormDialog('login');
    }
  }

  public async register() {
    if (! this.isLogged()) { // register
      this.openUserFormDialog('register');
      // await this.authService.register( 'sam.va@gmail.com', 'secret');
    }
  }

  public isLogged(): boolean {
    return this.authService.isLogged();
  }

  public getCurrentUserFullName() : string {
    return this.authService.getCurrentUserFullName();;
  }

  openUserFormDialog(formType: 'login' | 'register'): void {
    let userForm: any = { formType: formType, password: "secret"  };
    if (formType == "login")
      userForm = { ...userForm, email: "sam.va@gmail.com"};

    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '300px',
      //data: {}
      data: userForm
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (!result) return;
      userForm = result;
      switch (formType) {
        case 'register': {
          await this.authService.register( userForm.email, userForm.password);
          break;
        }
        case 'login': {
          await this.authService.login( userForm.email, userForm.password).then( () => {
            // console.log(await this.authService.test(););
            this.router.navigate(['/dashboard']);
          }).catch((err) => {
            console.log(err);
          })
          break;
        }
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
