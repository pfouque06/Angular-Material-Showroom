import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThemeModalComponent } from 'src/app/shared/components/modals/theme-modal/theme-modal.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  email: string;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void { }

  openDialog(): void {
    const dialogRef = this.dialog.open(ThemeModalComponent, {
      width: '600px',
      //data: {}
      data: {email: this.email}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.email = result;
    });
  }

}
