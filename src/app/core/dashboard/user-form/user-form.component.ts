import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  @Input() userId: number = null;

  constructor(private route: ActivatedRoute) { }

  async ngOnInit(): Promise<void> {
    console.log(`UserFormComponent.ngOnInit(userId: ${this.userId})`);

    if (!this.userId) {
      // retrieve user if id provided in incoming route
      this.userId = this.route.snapshot.params.id;
      console.log(`--> params.id: ${this.userId}`);
      if (!this.userId) {
        console.log("no id provided : creating a new User");
      }
    }
  }
}
