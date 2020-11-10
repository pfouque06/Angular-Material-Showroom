import { AsyncPipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, timer } from 'rxjs';
import { skip, switchMap, take } from 'rxjs/operators';
import { UserModalComponent } from 'src/app/shared/components/modals/user-modal/user-modal.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { State } from 'src/app/shared/store/states';
import { selectUserState } from 'src/app/shared/store/user/user.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() public title: string;

  // private isLogged$: Promise<boolean>;
  private heartBeatService: Observable<any>;
  private loggedService: Subscription;
  private loggedState: boolean = false;
  public fullName: string = '';

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router
  ) {
    // heartBeatService init
    this.heartBeatService = timer(2000, 10000) // or interval(10000)

    // subscriptions
    // this.isLogged$ = this.authService.isLogged();

    // loggedService register
    this.loggedService = this.heartBeatService.subscribe( async () => {
      // console.log(`header.loggedState=${this.loggedState}`);
      const state = await this.authService.isLogged();
      this.authService.getCurrentUserFullName().then( (fn) => this.fullName = fn);
      // console.log(` -> new state=${state}`)  ;
      if (this.loggedState !== state) {
        console.log(`Header: logged State has changed ... reloading component`);
        this.loggedState = !! state;
        this.reloadCurrentRoute(); // this.ngOnInit();
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.loggedService.unsubscribe();
  }

  public get isLogged() {
    return !!this.loggedState;
  }

  public async getCurrentUserFullName() {
    let fullName: string = '';
    if (this.loggedState) {
      fullName = await this.authService.getCurrentUserFullName()
    }
    return fullName;
  }

  public async loginToggle() {
    // logout
    if (this.loggedState) {
      await this.authService.logout();
      this.store.pipe( select(selectUserState), skip(1), take(1),
      // tap( (s) => console.log('AuthService.login().selectUserState: ', s)),
      ).subscribe(
        (state) => {
          if ( !state.errors ) {
              this.loggedState = false;
              // reroute page if all is fine, this.router.url is route name
              if (this.router.url.match('^\/dashboard')) {
                this.router.navigate(['/home']);
              // delay navigation because of guard control too quick !!
              // console.log('Navigating to Koa dashboard in a short moment...');
              // setTimeout(()=>{ this.router.navigate(['/dashboard']); }, 500)
            }
          }
        }
      );
    } else { this.openUserFormDialog('login'); } // login
  }

  public async profileToggle() {
    if (this.loggedState) { // view Profile
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
      //data: {}
      data: userForm
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) return;
      userForm = result;
      switch (formType) {
        case 'register': {
          this.authService.register( userForm.email, userForm.password);
          break;
        }
        case 'login': {
          await this.authService.login( userForm.email, userForm.password);
          this.store.pipe( select(selectUserState), skip(1), take(1),
          // tap( (s) => console.log('AuthService.login().selectUserState: ', s)),
          ).subscribe(
            (state) => {
              if ( !state.errors ) {
                this.loggedState = true;
                this.authService.getCurrentUserFullName().then( (fn) => this.fullName = fn);
                this.router.navigate(['/dashboard']);
                // delay navigation because of guard control too quick !!
                // console.log('Navigating to Koa dashboard in a short moment...');
                // setTimeout(()=>{ this.router.navigate(['/dashboard']); }, 500)
              }
            }
          );
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
