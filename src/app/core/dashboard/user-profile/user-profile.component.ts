import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/class/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public isLoading: boolean = false;
  public user: User = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.isLoading = false;
  }

}
