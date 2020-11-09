import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/class/user';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PasswordChangeModalComponent } from '../../modals/password-change-modal/password-change-modal.component';

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
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
    ) {}

  async ngOnInit(){
    console.log(`ProfileUserDetailsComponent.ngOninit(readOnly: ${this.readOnly}, userId: ${this.userId})`);

    try {
      if ( this.userId ) {
        // retrieve user if id is provided within directive [userId]
        console.log("Id provided --> querying User profile (Id: " + this.userId + ")");
        this.user = await this.userService.getById(this.userId);
      } else {
        if (this.readOnly) {
          // retrieve user from currentUser
          console.log("No Id provided --> get myself()");
          this.user = await this.authService.getCurrentUser();
        } else {
          console.log("No Id provided --> creating New User");
          this.user = new User({});
        }
      }
    } catch (error) {
      console.log("Error: ", error);
      throw Error(error);
    }

    // generating form group if needed
    if (!this.readOnly) {
      // instantiate Form
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

    this.isLoading = false;
  }

  ngAfterViewInit(){}

  async getUser(id: number) {
    // console.log(`ProfileUserDetailsComponent.getUser(id: ${id})`);
    await this.userService.getById(id).then((data) => {
      this.user = new User(data);
      return this.user;
    }).catch((error) => {
      console.log(error);
    });
  }

  public editProfile() {
    // [routerLink]="['/users/form/${userPick.id}']" [queryParams]="{user: user}"
    // this.router.navigate([`/users/form/${this.userPickId}`], { queryParams: { id:  this.userPickId }});
    const url = `dashboard/users/form/${this.user.id}`;
    this.router.navigate([url]);
  }

  public async submit() {
    if (this.userChanged()) { // any change done ?

      if (this.userId) { /// userForm for an existing User
        try {
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
          const updatedUser = await this.userService.updateById(this.user.id, newUser);

          // update myself if needed
          if (this.isMyself()) { this.authService.myself(); }
        } catch (error) {
          console.log(error);
          return;
        }
      } else { /// userForm for a new User
        try {
          const newUser = await this.userService.create(this.userForm);
          console.log('newUser: ', newUser);
          this.userId = newUser.id;
          console.log('userId: ', this.userId);
        } catch (error) {
          console.log(error);
          return;
        }

      }
    }

    // finally route to user profile
    if (this.userId) { /// userForm for an existing or created User
      const url = `dashboard/users/profile/${this.userId}`;
      this.router.navigate([url]);
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
    //get modal with previous password and new password in 2 steps !!
    this.openPasswordChangeDialog();
  }

  public openPasswordChangeDialog(): void {
    // call dialog
    const dialogRef = this.dialog.open(PasswordChangeModalComponent, {
      width: '400px',
      data: {}
    });
    // wait dialog close event
    dialogRef.afterClosed().subscribe(async data => {
      if (!data) return;
      try {
        await this.authService.changePassword(data.password, data.newPassword);
      } catch (error) {
        console.log(error);
      }
    });
  }

  private reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}


