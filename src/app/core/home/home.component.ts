import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public loading: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loading = false;
  }

  public ping(): boolean {
    return this.authService.pong;
  }
}
