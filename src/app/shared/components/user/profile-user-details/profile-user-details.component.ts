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

  @Input() readOnly: boolean;
  @Input() userLogged: User;

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
    console.log("ngOninit");

    // retrive currentUser
    this.userLogged = this.userService.getCurrentUser();
    this.userPick = this.userLogged;

    // retrieve user if id provided in incoming route
    this.userPickId = this.route.snapshot.params.id;
    if (this.userPickId) {
      await this.getUser(this.userPickId).then((user) => {
        this.userPick = new User(user);
      }).catch((err) => {
        console.log(err);
      });
    }

  }

  ngAfterViewInit(){
    console.log("afterInit");
  }

  async getUser(id: number) {
    await this.userService.getById(id).then((data) => {
      this.userPick = data;
      return this.userPick;
    }).catch((error) => {
      console.log(error);
    });
  }




}


