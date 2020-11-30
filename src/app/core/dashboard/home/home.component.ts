import { Component, OnInit } from '@angular/core';
import { AuthService } from 'koa-services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public ping: boolean = false;
  public loading: boolean = true;

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.ping = await this.authService.ping();
    this.loading = false;
  }
}
