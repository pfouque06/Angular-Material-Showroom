import { Component, Inject } from '@angular/core';
import { AuthService, SERVER_ADDRESS, SERVER_PROTOCOL } from 'koa-services';

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
