import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  // public isLoading: boolean = false;
  @Input() userId: number = null;

  constructor(private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    console.log("UserProfileComponent.ngOnInit()");

    console.log("this.userId: ", this.userId);
    if (!this.userId) {
      // retrieve user if id provided in incoming route
      this.userId = this.route.snapshot.params.id;
      console.log("this.route.snapshot.params.id: ", this.userId);
      if (!this.userId) {
        console.log("no id provided : create a new User");
        // this.loading = false;
      }
    }
    // this.isLoading = false;
  }

}
