import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-theme-modal',
  templateUrl: './theme-modal.component.html',
  styleUrls: ['./theme-modal.component.css']
})
export class ThemeModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ThemeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }

  onSubmitClick(): void {
    console.log(this.data.email);
    this.dialogRef.close(this.data.email);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
