import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserModalComponent } from 'src/app/shared/components/modals/user-modal/user-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() public title: string;

  private loggedState: boolean = undefined;
  private loggedService: Observable<any>;
  private loggedListener: Subscription;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router ) {

    // loggedService init
    this.loggedService = timer(2000, 10000) // or interval(10000)
      .pipe(
        switchMap((value) => {
          // return new Promise((resolve, reject) => { resolve(this.authService.isLogged()); })
          let state: boolean = this.authService.isLogged();
          // console.log(`loggedService: state=${this.loggedState} new state= `,state);
          if (this.loggedState !== state) {
            console.log(`logged State has changed ... reloading component`);
            this.loggedState = state;
            this.reloadCurrentRoute(); // this.ngOnInit();
          }
          return new Promise((resolve, reject) => { resolve(state); })
        })
      );

    // loggedService register
    this.loggedListener = this.loggedService.subscribe()
  }

  ngOnDestroy(): void {
    this.loggedListener.unsubscribe();
  }

  ngOnInit(): void { }

  public ping(): boolean {
    return this.authService.pong;
  }

  public async loginToggle() {
    if (this.isLogged()) { // logout
      if (await this.authService.logout()) {
        this.loggedState = false;
        // reroute page if all is fine, this.router.url is route name
        if (this.router.url.match('^\/dashboard')) {
          this.router.navigate(['/home']);
        }
      }
    } else { // login
      this.openUserFormDialog('login');
    }
  }

  public viewProfile() {
    const url = `dashboard/users/profile/`;
    this.router.navigate([url]);
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
            this.loggedState = true;
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
