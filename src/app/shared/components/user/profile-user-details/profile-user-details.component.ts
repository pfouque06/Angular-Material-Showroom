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

  user: User;
  userForm: User;
  userFormGroup: FormGroup;
  // public cardRef: TemplateRef<any>;


  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router
    ) {}

  async ngOnInit(){
    // console.log(`ProfileUserDetailsComponent.ngOninit(readOnly: ${this.readOnly}, userId: ${this.userId})`);

    try {
      if (this.userId) {
        // retrive user if id is provided within directive [userId]
        this.user = await this.userService.getById(this.userId);
      } else {
        // retrieve user from currentUser
        if (this.readOnly) {
          this.user = await this.authService.myself();
          console.log("No Id provided --> got myself(Id: " + this.user.id + ")");
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
      // console.log(" -->instantiate userFormGroup");
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
        // console.log(" -->initialize userFormGroup with provided user");
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
      } else {
        // initialize formGroup
        // console.log(" -->initialize userFormGroup with a new user");
      }
      // } else {
      //   this.userFormGroup.disable();
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
    // console.log(`ProfileUserDetailsComponent.editProfile()`);
    // [routerLink]="['/users/form/${userPick.id}']" [queryParams]="{user: user}"
    // this.router.navigate([`/users/form/${this.userPickId}`], { queryParams: { id:  this.userPickId }});
    const url = `dashboard/users/form/${this.user.id}`;
    // console.log(`--> route to: ${url}`);
    this.router.navigate([url]);
  }

  public async submit() {
    // console.log(`ProfileUserDetailsComponent.submit()`);
    // console.log("user: ", this.user);
    // console.log("userForm: ", this.userForm);
    if (this.userChanged()) { // any change done ?

      if (this.userId) { /// userForm for an existing User

        // console.log("USER CHANGED !!!");
        try {
          if (this.isMyself() && this.userForm.profile != this.user.profile) {
            const error: string = "Error: can't change own profile type";
            console.log(error);
            throw Error(error)
          }
          // remove password from data ( handled separately)
          let { password, ...newUserData} = this.userForm;
          // console.log("removing PASSWORD -> newUserData: ", newUserData);

          let newUser = new User(newUserData);
          // remove email if not changed
          if (this.userForm.email == this.user.email) {
            let { email, ...newUserData} = newUser;
            // console.log("removing EMAIL -> newUserData: ", newUserData);
            newUser = new User(newUserData);
          }
          // update user
          this.user = await this.userService.updateById(this.user.id, newUser);
        } catch (error) {
          console.log(error);
        }
      } else { /// userForm for a new User
        try {
          this.user = await this.userService.create(this.userForm);
          this.userId = this.user.id;
        } catch (error) {
          console.log(error);
        }

      }
    }

    if (this.userId) { /// userForm for an existing User
      const url = `dashboard/users/profile/${this.user.id}`;
      // console.log(`--> route to: ${url}`);
      this.router.navigate([url]);
    } else {
      // const url = `dashboard/users/list`;
      // console.log(`--> route to: ${url}`);
      // this.router.navigate([url]);
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
    const user = await this.authService.getCurrentUser();
    return ( !this.userId || user.id == this.user.id);
  }

  public async isAdmin() {
    // console.log("this.authService.getCurrentUser().profile: ", this.authService.getCurrentUser().profile);
    const user = await this.authService.getCurrentUser();
    return ( user.profile == "admin" );
  }

  public isNew() {
    return (!this.userId);
  }

  public async changePassword() {
    //get modal with previous password and new password in 2 steps !!
    this.openPasswordChangeDialog();
  }

  public openPasswordChangeDialog(): void {
    // let userForm: any = { formType: formType, password: "secret"  };
    // if (formType == "login")
    //   userForm = { ...userForm, email: "sam.va@gmail.com"};

    const dialogRef = this.dialog.open(PasswordChangeModalComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(async data => {
      if (!data) return;
      try {
        await this.authService.changePassword(data.password, data.newPassword);
      } catch (error) {
        console.log(error);
      }
    });
  }
}


