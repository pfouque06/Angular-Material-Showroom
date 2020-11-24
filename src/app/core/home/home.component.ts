import { Component, Inject, OnInit } from '@angular/core';
import { SERVER_ADDRESS, SERVER_PROTOCOL } from 'src/app/shared/services/api-helper.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public loading: boolean = true;
  public swagger: string;

  constructor(
    @Inject(SERVER_ADDRESS) public readonly serverAddress: string,
    @Inject(SERVER_PROTOCOL) public readonly serverProtocol: 's' | '',
    private authService: AuthService) {
      this.swagger = `http${this.serverProtocol}://${this.serverAddress}/swagger`;
    }

  ngOnInit() {
    this.loading = false;
  }

  public ping(): boolean {
    return this.authService.pong;
  }
}
