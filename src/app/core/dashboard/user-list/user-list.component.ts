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
  public user: Partial<User>;

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

  async ngOnInit() {
    // console.log('ngOnInit', this.dataSource);
    // retrieve user from currentUser
    this.user = await this.authService.getCurrentUser();
  }

  ngAfterViewInit() {
    this.initDataSource();
    // this.reloadCurrentRoute()
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
    console.log(`UserListComponent.view(${row.id})`);
    const url = `dashboard/users/profile/${row.id}`;
    this.router.navigate([url]);
  }

  edit(row: any) {
    console.log(`UserListComponent.edit(${row.id})`);
    const url = `dashboard/users/form/${row.id}`;
    this.router.navigate([url]);
  }

  isEditable(row: any): boolean {
    return (this.user.profile == "admin") || (this.user.id == row.id) ;
  }

  isRemovable(row: any): boolean {
    return (this.user.profile == "admin") && (this.user.id != row.id) ;
  }

  remove(row: any) {
    console.log(`UserListComponent.remove(id: ${row.id})`);
    this.openAdminConfirmationDialog('userRemove', row.id);
  }

  openAdminConfirmationDialog(formType: 'userRemove', id: number) {
    // call dialog
    const dialogRef = this.dialog.open(ConfirmationModalComponent, { width: '500px', data: { formType: formType, id: id } });

    // wait dialog close event
    dialogRef.afterClosed().subscribe(async confirmFeedback => {
      if (confirmFeedback && confirmFeedback.confirmed) {
        switch (confirmFeedback.formType) {
          case 'userRemove': {
            console.log('id to remove: ', confirmFeedback.id);
            try {
              await this.userService.deleteById(confirmFeedback.id as number);
              this.reloadCurrentRoute();
            } catch (error) {
              console.log(error);
            }
            break;
          }
        }
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
