import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/class/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public loading: boolean = true;
  public users: Array<User> = [];

  constructor(private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    this.users =  await this.userService.getAllUser();
    console.log(this.users);

    this.loading = false;
  }

}
