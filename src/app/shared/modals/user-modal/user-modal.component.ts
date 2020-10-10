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
    //@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    @Inject(MAT_DIALOG_DATA) public data: any) {
      //this.myEmail = data.email;
      switch (data.formType) {
        case 'register': {
          this.title = "Register new account";
          break;
        }
        case 'login': {
          this.title = "Login a registered account";
          break;
        }
      }
    }

  ngOnInit(): void {
  }

  onSubmitClick(): void {
    // this.myEmail = this.data.email;
    // console.log(this.myEmail);
    console.log(this.data);

    //this.dialogRef.close({event:'close',email: this.data.email});
    // this.dialogRef.close(this.myEmail);
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
