import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
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

  // public users: User[] = [];

  // displayedColumns: string[] = ['firstName', 'lastName', 'profile', 'id'];
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'profile', 'operations'];
  // dataSource: MatTableDataSource<User>;
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router ) { console.log('constructor', this.dataSource); }

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit', this.dataSource);
  }

  async ngAfterViewInit() {
    await this.initDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    console.log('ngAfterViewInit', this.dataSource);
    this.loading = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async initDataSource() {
    // retrive user lists

    // this.dataSource = new MatTableDataSource(MOCK_DATA);


    const users =  await this.userService.getAllUser();
    console.log(users);
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(users);
    console.log(this.dataSource);

    // this.userService.getAllUser().then( (users) => {
    //   console.log(users);
    //   // Assign the data to the data source for the table to render
    //   this.dataSource = new MatTableDataSource(users);
    //   console.log(this.dataSource);
    // }).catch((err) => {
    //   console.log(err);
    // });
    console.log('initDataSource', this.dataSource);
  }

  view(row: any) {
    console.log(`UserListComponent.view()`);
    const url = `dashboard/users/profile/${row.id}`;
    console.log(`--> route to: ${url}`);
    this.router.navigate([url]);
  }

  isRemovable(row: any): boolean {
    // console.log('profile:' , this.authService.getCurrentUser().profile);
    return (this.authService.getCurrentUser().profile == "admin") && (this.authService.getCurrentUser().id != row.id) ;
  }

  remove(row: any) {
    console.log(`UserListComponent.remove(id: ${row.id})`);
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
            console.log('id to remove: ', confirmFeedback.id);
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
