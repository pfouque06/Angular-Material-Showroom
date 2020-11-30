import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { filter, map, skip, take } from 'rxjs/operators';
import { PasswordChangeModalComponent } from '../../modals/password-change-modal/password-change-modal.component';
import { User, AuthService, UserService, State, selectAllUsers, selectUserState, selectUserSetState } from 'koa-services';
import { UItoolingService } from 'src/app/shared/services/UITooling.service';

@Component({
  selector: 'app-profile-user-details',
  templateUrl: './profile-user-details.component.html',
  styleUrls: ['./profile-user-details.component.scss']
})
export class ProfileUserDetailsComponent implements OnInit {

  public isLoading: boolean = true;

  @Input() readOnly: boolean = true;
  @Input() userId: number = null;

  public user: Partial<User>;

  public userForm: User;
  public userFormGroup: FormGroup;

  constructor(
    private store: Store<State>,
    private authService: AuthService,
    private userService: UserService,
    private UITooling: UItoolingService,
    private router: Router
    ) {}

  async ngOnInit(){
    // console.log(`ProfileUserDetailsComponent.ngOninit(readOnly: ${this.readOnly}, userId: ${this.userId})`);
    if ( this.userId ) { // retrieve user if id is provided within directive [userId]
      this.userService.getById(this.userId);
      // handle error
      this.store.pipe( select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
      .subscribe( (errors) => {
        this.UITooling.fireGlobalAlertSnackBar('[GetById] Operation has failed! Please check logs and retry', 'snack-bar-error' );
      });
      // get user
      this.store.pipe( select(selectAllUsers), skip(1), take(1) )
      .subscribe( (users) => {
        this.user  = users[0];
        this.initForm();
      });
    } else { // no Id provided
      // if read only mode, retrieve user from currentUser, else creating New User
      if (this.readOnly) { this.user = await this.authService.getCurrentUser(); }
      else { this.user = new User({}); }
      this.initForm();
    }
  }

  public initForm() {
    // generating form group if needed
    if (!this.readOnly) {
      this.userForm = new User({});
      this.userFormGroup = new FormGroup({
        firstName: new FormControl('', [Validators.minLength(2), Validators.maxLength(25)]),
        lastName: new FormControl('', [Validators.minLength(2), Validators.maxLength(25)]),
        // birthDate: new FormControl(moment(), Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        mobile: new FormControl('', [Validators.minLength(10)]), // add numeric pattern
        profile: new FormControl('', [Validators.required, Validators.minLength(3)]), /// attention , c'est un select !!!
        password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]),
      });
      this.userFormGroup.valueChanges.subscribe(data => {
        this.userForm.lastName = data.lastName.toLowerCase();
        this.userForm.firstName = data.firstName.toLowerCase();
        // this.userForm.birthDate = data.birthDate;
        this.userForm.email = data.email;
        this.userForm.mobile = data.mobile;
        this.userForm.profile = data.profile;
        this.userForm.password = data.password;
      });

      let onChangeFunction = data => {
        this.userForm.lastName = data.lastName.toLowerCase();
        this.userForm.firstName = data.firstName.toLowerCase();
        // this.userForm.birthDate = data.birthDate;
        this.userForm.email = data.email;
        this.userForm.mobile = data.mobile;
        this.userForm.profile = data.profile;
        this.userForm.password = data.password;
      }

      if (this.userId) {
        // initialize formGroup
        this.userFormGroup.setValue({
          lastName: this.user.lastName,
          firstName: this.user.firstName,
          // birthDate: this.user.birthDate? this.user.birthDate:"",
          email: this.user.email,
          mobile: this.user.mobile? this.user.mobile:"",
          profile: this.user.profile,
          password: ""
        });
      }
    }

    // inform view that data is ready
    this.isLoading = false;
  }

  public editProfile() {
    // [routerLink]="['/users/form/${userPick.id}']" [queryParams]="{user: user}"
    // this.router.navigate([`/users/form/${this.userPickId}`], { queryParams: { id:  this.userPickId }});
    const url = `dashboard/users/form/${this.user.id}`;
    this.router.navigate([url]);
  }

  public submit() {
    if (this.userChanged()) { // any change done ?

      if (this.userId) { /// userForm for an existing User
        if (this.isMyself() && this.userForm.profile != this.user.profile) {
          const error: string = "Error: can't change own profile type";
          console.log(error);
          throw Error(error)
          }

          // remove password from data ( handled separately)
          let { password, ...newUserData} = this.userForm;
          let newUser = new User(newUserData);

          // remove email if not changed because of uniqueness validator of api.koa
          if (this.userForm.email == this.user.email) {
            let { email, ...newUserData} = newUser;
            newUser = new User(newUserData);
          }

          // update user
          this.userService.updateById(this.userId, newUser);
          // handle result
          this.store.pipe( select(selectUserSetState), skip(1), take(1))
          .subscribe( (state) => {
            if (!!state.errors && state.errors.error) {
              this.UITooling.fireGlobalAlertSnackBar('[UpdateById] Operation has failed! Please check logs and retry', 'snack-bar-error' );
            } else {
              // const updatedUser = users[0];
              // update myself if needed
              if (this.isMyself()) { this.authService.myself(); }
              // finally route to user profile
              this.routeToUserForm(this.userId);
            }
          });

      }
      else { /// userForm for a new User
        console.log('###### create new user !!###');

        this.userService.create(this.userForm);
        // handle error
        this.store.pipe( select(selectUserSetState), skip(1), take(1), filter( (s) => !!s.errors && s.errors.error), map( (s) => s.errors.error))
        .subscribe( (errors) => {
          // for( const key in errors ) { console.log(`errors[${key}] `, errors[key]); };
          this.UITooling.fireGlobalAlertSnackBar('[Create] Operation has failed! Please check logs and retry', 'snack-bar-error' );
        });
        // get new user
        this.store.pipe( select(selectAllUsers), skip(1), take(1) )
        .subscribe( (users) => {
          this.userId = users[0].id;
          this.UITooling.fireGlobalAlertSnackBar('New user creation is successfull', 'snack-bar-success');
          // finally route to user profile
          this.routeToUserForm(this.userId);
        });

      }
    }
  }

  public userChanged(): boolean {
    return this.user && this.userForm && (
      this.user.lastName != this.userForm.lastName ||
      this.user.firstName != this.userForm.firstName ||
      this.user.email != this.userForm.email ||
      // this.user.birthDate !== this.userForm.birthDate ||
      this.user.mobile != this.userForm.mobile ||
      this.user.profile!= this.userForm.profile
    );
  }

  public async isMyself() {
    // console.log(`profile-user-details.isMyself(${this.userId}, ${this.user.id}): ${!this.userId || this.userId == this.user.id}`);
    return ( !this.userId || this.userId == this.user.id);
  }

  public async isAdmin() {
    return ( this.user.profile === "admin" );
  }

  public isNew() {
    return (!this.userId);
  }

  public async changePassword() {
    console.log(`ProfileUserDetailsComponent.changePassword()`);
    // get modal with previous password and new password in 2 steps !!
    const dialogRef = this.UITooling.fireDialog(PasswordChangeModalComponent, {
      width: '400px',
      data: {}
    });
    // wait dialog close event
    dialogRef.afterClosed().subscribe(async data => {
      console.log(`ProfileUserDetailsComponent.dialogRef.afterClosed(password: ${data.password}, newPassword: ${data.newPassword})`);
      if (!data) return;
      this.authService.changePassword(data.password, data.newPassword);
      this.store.pipe( select(selectUserState), skip(1), take(1))
      .subscribe( (state) => {
        if ( !!state.errors) {
          this.UITooling.fireGlobalAlertSnackBar('Password change has failed! Please check api.koa logs', 'snack-bar-error' );
        } else {
          this.UITooling.fireGlobalAlertSnackBar('Password change is successfull, you can now login with your new credential', 'snack-bar-success');
        }
      })
    });
  }

  private reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  private routeToUserForm(id: number) {
    const url = `dashboard/users/profile/${id}`;
    this.router.navigate([url]);
  }
}


