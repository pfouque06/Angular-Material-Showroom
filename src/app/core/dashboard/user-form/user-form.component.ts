import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/class/user';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  public loading: boolean = true;
  public user: User = null;

  constructor(private userService: UserService) { }

  async ngOnInit(): Promise<void> {
    // this.user =  await this.userService.getById(......);
    // console.log(this.user);

    this.loading = false;
  }

}
