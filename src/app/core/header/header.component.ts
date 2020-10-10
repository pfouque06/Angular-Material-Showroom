import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from 'src/app/shared/modals/user-modal/user-modal.component';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() public title: string;
  public login: boolean = false;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  public async loginToggle() {
    if (this.login) { // logout
      if (await this.authService.logout()) this.login = false;
    } else { // login
      this.openUserFormDialog('login');
      // if (await this.authService.login( 'sam.va@gmail.com', 'secret')) this.login = true;
      // const result: string = await this.authService.test();
      // console.log(result);
    }
  }

  public async register() {
    if (! this.login) { // register
      this.openUserFormDialog('register');
      // await this.authService.register( 'sam.va@gmail.com', 'secret');
    }
  }

  public getCurrentUserFullName() : string {
    const user = this.authService.getCurrentUser();
    let result: string = "none";
    if ( user.firstName != "none" || user.lastName != "none" )
      result = user.firstName + ' ' + user.lastName;
    return result;
  }

  openUserFormDialog(formType: 'login' | 'register'): void {
    console.log(formType);

    let userForm: any = { formType: formType, password: "secret"  };
    if (formType == "login")
      userForm = { ...userForm, email: "sam.va@gmail.com"};

    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '600px',
      //data: {}
      data: userForm
    });

    dialogRef.afterClosed().subscribe(async result => {
      userForm = result;
      console.log(userForm);
      switch (formType) {
        case 'register': {
          await this.authService.register( userForm.email, userForm.password);
          break;
        }
        case 'login': {
          if (await this.authService.login( userForm.email, userForm.password)) this.login = true;
          const result: string = await this.authService.test();
          console.log(result);
          break;
        }
      }
    });
  }
}
