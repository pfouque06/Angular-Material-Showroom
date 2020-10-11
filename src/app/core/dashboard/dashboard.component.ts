import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public ping: boolean = false;
  public loading: boolean = true;

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.ping = await this.authService.ping();
    this.loading = false;
  }
}
