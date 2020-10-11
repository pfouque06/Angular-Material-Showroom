import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  @Input() public title: string;

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    switch (data.formType) {
      case 'usersReset': {
        this.title = "User Table Reset confirmed ?";
        break;
      }
      case 'authReset': {
        this.title = "Authenticated Sessions Reset confirmed ?\nYou will be logged out after reset.";
        break;
      }
    }
  }

  ngOnInit(): void {
  }

  onSubmitClick(): void {
    this.data =  { ...this.data, confirmed: true};
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
