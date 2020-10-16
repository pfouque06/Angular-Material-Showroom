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
  @Input() user: User = null;
  @Input() userId: number = null;

  public cardRef: TemplateRef<any>;
  public title: string = "User profile";

  userPickId: number;
  userPick: User = new User({});

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    ) {}

    async ngOnInit(){
      console.log("ProfileUserDetailsComponent.ngOninit()");

      // retrieve user if id provided in incoming route
      this.userPickId = this.route.snapshot.params.id;
      if (!this.userPickId) {
        // retrive user if id is provided within directive [userId]
        this.userPickId = this.userId;
        if (!this.userPickId) {
          // retrive user if user is provided within directive [user]
          this.userPick = this.user;
          if (!this.userPick) {
            // retreive user from currentUser
            // this.user = this.userService.getCurrentUser();
            try {
              this.userPick = await this.authService.myself();
            } catch (error) {
              console.log("Error: no id provided");
              throw Error("Error:  no id provided")
            }
          }
          this.isLoading = false;
          return;
        }
      }
      await this.getUser(this.userPickId);
      this.isLoading = false;
    }

    ngAfterViewInit(){
      console.log("afterInit");
    }

    async getUser(id: number) {
      console.log(`ProfileUserDetailsComponent.getUser(id: ${id})`);
      await this.userService.getById(id).then((data) => {
        this.userPick = new User(data);
        return this.userPick;
      }).catch((error) => {
        console.log(error);
      });
    }




  }


