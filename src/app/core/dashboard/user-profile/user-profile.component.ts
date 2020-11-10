import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  @Input() userId: number = null;

  constructor(private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    console.log(`UserProfileComponent.ngOnInit(userId: ${this.userId})`);

    if (!this.userId) {
      // retrieve user if id provided in incoming route
      console.log('route: ${this.route.url}');
      this.userId = this.route.snapshot.params.id;
      console.log(`--> params.id: ${this.userId}`);
      if (!this.userId) {
        console.log("no id provided : shifting to current User");
      }
    }
  }

}
