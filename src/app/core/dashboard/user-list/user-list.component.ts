import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/components/modals/confirmation-modal/confirmation-modal.component';
import { User } from 'src/app/shared/models/class/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

interface mockUser {
  id: number;
  firstName: string;
  lastName: string;
  profile: 'admin' | 'user';
};

const MOCK_DATA: mockUser[] = [
  {id: 1, firstName: 'sam', lastName: "va", profile: 'admin'},
  {id: 2, firstName: 'jean', lastName: "pile", profile: 'user'},
];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {

  public loading: boolean = true;
  public title: string = "User list";


  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'profile', 'operations'];
  dataSource: MatTableDataSource<User>;

// @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
// @ViewChild(MatSort, { static: false }) sort: MatSort;
public paginator: MatPaginator;
@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  this.paginator = mp;
  this.setDataSourceAttributes();
}
public sort: MatSort;
@ViewChild(MatSort) set matSort(ms: MatSort) {
  this.sort = ms;
  this.setDataSourceAttributes();
}

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router ) { /* console.log('constructor', this.dataSource); */ }

  ngOnInit() { /* console.log('ngOnInit', this.dataSource); */ }

  ngAfterViewInit() {
    this.initDataSource();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  initDataSource() {
    // retrive user lists
    this.userService.getAllUser().then((users) => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(users);
    })
  }

  setDataSourceAttributes() {
    // affect paginator if needed and available
    if (!this.dataSource.paginator && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    // affect sort if needed and available
    if (!this.dataSource.sort && this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  view(row: any) {
    // console.log(`UserListComponent.view()`);
    const url = `dashboard/users/profile/${row.id}`;
    this.router.navigate([url]);
  }

  edit(row: any) {
    // console.log(`UserListComponent.edit()`);
    const url = `dashboard/users/form/${row.id}`;
    this.router.navigate([url]);
  }

  async isEditable(row: any): Promise<boolean> {
    // console.log('profile:' , this.authService.getCurrentUser().profile);
    const user = await this.authService.getCurrentUser();
    return (user.profile == "admin") || (user.id == row.id) ;
  }

  async isRemovable(row: any): Promise<boolean> {
    // console.log('profile:' , this.authService.getCurrentUser().profile);
    const user = await this.authService.getCurrentUser();
    return (user.profile == "admin") && (user.id != row.id) ;
  }

  remove(row: any) {
    // console.log(`UserListComponent.remove(id: ${row.id})`);
    this.openAdminConfirmationDialog('userRemove', row.id);
  }

  openAdminConfirmationDialog(formType: 'userRemove' | 'default', id: number) {
    let userForm: any = { formType: formType, password: "secret", id: id };

    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: '500px',
      //data: {}
      data: userForm
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (! result) return;
      const confirmFeedback = result;
      if (confirmFeedback.confirmed) {
        switch (confirmFeedback.formType) {
          case 'userRemove': {
            // console.log('id to remove: ', confirmFeedback.id);
            try {
              await this.userService.deleteById(confirmFeedback.id as number);
              let currentUrl = this.router.url;
              this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
                this.router.navigate([currentUrl]);
              });
            } catch (error) {
              console.log(error);
            }
            break;
          }
          case 'default': {
            break;
          }
        }
      }
    });
  }
}
