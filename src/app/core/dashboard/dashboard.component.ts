import { Component, Inject } from '@angular/core';
import { SERVER_ADDRESS, SERVER_PROTOCOL } from 'src/app/shared/services/api-helper.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  public swagger: string;

  constructor(
    @Inject(SERVER_ADDRESS) public readonly serverAddress: string,
    @Inject(SERVER_PROTOCOL) public readonly serverProtocol: 's' | '',
    private authService: AuthService) {
      this.swagger = `http${this.serverProtocol}://${this.serverAddress}/swagger`;
    }

  public ping(): boolean {
    return this.authService.pong;
  }
}
