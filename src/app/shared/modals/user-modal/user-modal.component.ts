import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {

  @Input() public title: string;

  constructor(public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      switch (data.formType) {
        case 'register': {
          this.title = "Register a new account";
          break;
        }
        case 'login': {
          this.title = "Login";
          break;
        }
      }
    }

  ngOnInit(): void {
  }

  onSubmitClick(): void {
    // console.log(this.data);
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
