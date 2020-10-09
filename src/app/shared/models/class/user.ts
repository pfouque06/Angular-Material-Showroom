export class User {

  public id: number = -1;
  public firstName: string;
  public lastName: string;
  public birthDate: Date;
  public mobile: string;
  public email: string;
  public password: string;
  public profile: string;
  public accessToken: string;
  // public posts: Post[];

  constructor(
    data: any,
  ) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.birthDate = data.birthDate;
    this.mobile = data.mobile;
    this.email = data.email;
    this.password = data.password;
    this.profile = data.profile;
    this.accessToken = data.accessToken;
    // this.posts= data.posts.map(..);
  }
}
