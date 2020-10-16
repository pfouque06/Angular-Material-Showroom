import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/shared/models/class/user';
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
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'profile'];
  // dataSource: MatTableDataSource<User>;
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService) {
    console.log('constructor', this.dataSource);
  }

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
}
