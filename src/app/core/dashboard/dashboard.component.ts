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
    await this.authService.ping().then((ping) => {
      this.ping = ping;
    }).catch((err) => {
      this.ping = false;
    });
    this.loading = false;
  }
}
