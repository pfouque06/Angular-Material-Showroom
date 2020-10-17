import { Component, OnInit, Input, ViewChild, Output, TemplateRef, SimpleChanges } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/class/user';

@Component({
  selector: 'app-profile-user-details',
  templateUrl: './profile-user-details.component.html',
  styleUrls: ['./profile-user-details.component.scss']
})
export class ProfileUserDetailsComponent implements OnInit {

  public isLoading: boolean = true;

  @Input() readOnly: boolean = true;
  @Input() userId: number = null;

  public cardRef: TemplateRef<any>;

  user: User = new User({});

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
    ) {}

    async ngOnInit(){
      console.log(`ProfileUserDetailsComponent.ngOninit(readOnly: ${this.readOnly}, userId: ${this.userId})`);

      // retrive user if id is provided within directive [userId]
      if (this.userId) {
        await this.getUser(this.userId);
      } else {
        // retrieve user from currentUser
        try {
          this.user = await this.authService.myself();
        } catch (error) {
          console.log("Error: no id provided");
          throw Error("Error:  no id provided")
        }
        console.log("get myself, my Id: ", this.user.id);
      }
      this.isLoading = false;
    }

    ngAfterViewInit(){
      console.log("afterInit");
    }

    async getUser(id: number) {
      console.log(`ProfileUserDetailsComponent.getUser(id: ${id})`);
      await this.userService.getById(id).then((data) => {
        this.user = new User(data);
        return this.user;
      }).catch((error) => {
        console.log(error);
      });
    }

    editProfile() {
      console.log(`ProfileUserDetailsComponent.editProfile()`);
      // [routerLink]="['/users/form/${userPick.id}']" [queryParams]="{user: user}"
      // this.router.navigate([`/users/form/${this.userPickId}`], { queryParams: { id:  this.userPickId }});
      const url = `dashboard/users/form/${this.user.id}`;
      console.log(`--> route to: ${url}`);
      this.router.navigate([url]);
    }

    submit() {
      console.log(`ProfileUserDetailsComponent.submit()`);
      const url = `dashboard/users/profile/${this.userId}`;
      console.log(`--> route to: ${url}`);
      this.router.navigate([url]);
    }



  }


