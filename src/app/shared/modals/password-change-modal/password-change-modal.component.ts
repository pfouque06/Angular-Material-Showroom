import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
  selector: 'app-password-change-modal',
  templateUrl: './password-change-modal.component.html',
  styleUrls: ['./password-change-modal.component.css']
})
export class PasswordChangeModalComponent implements OnInit {

  public passwordFormGroup: FormGroup;
  public hidePassword: boolean = true;
  public hideNewPassword: boolean = true;
  public hideConfirmPassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.passwordFormGroup = this.fb.group({
      password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(25)]),
    }, { validator: this.checkPasswords });
    this.passwordFormGroup.setValue({
      password: null,
      newPassword: "",
      confirmPassword: "",
    });
  }


  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let newPass = group.get('newPassword').value;
    let confirmPass = group.get('confirmPassword').value;
    if (confirmPass == "") {
      return null;
    }

    return newPass === confirmPass ? null : { notSame: true }
  }

  onSubmitClick(): void {
    this.dialogRef.close({
      password: this.passwordFormGroup.get('password').value,
      newPassword: this.passwordFormGroup.get('newPassword').value
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
