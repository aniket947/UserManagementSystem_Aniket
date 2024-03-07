import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'ums-user-upsert',
  templateUrl: './user-upsert.component.html',
  styleUrls: ['./user-upsert.component.css']
})
export class UserUpsertComponent {
  selectedUser: User | undefined;
  addUserForm!: FormGroup;
  selectedUserData: User | undefined;
  allUsersList: User[] | undefined = [];

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit(): void {
    this.createUserForm();
    if (this.usersService.selectedUser) {
      this.allUsersList = this.usersService.allUsers;
      this.selectedUserData = this.usersService.selectedUser;
      this.addUserForm.patchValue(this.selectedUserData);
    }
  }

  createUserForm() {
    this.addUserForm = new FormGroup({
      id: new FormControl(),
      firstName: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      lastName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('[A-Za-z0-9._%+-]{1,}@[a-zA-Z0-9]{1,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')]),
    })
  }

  get f() {
    return this.addUserForm.controls;
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  createUser() {
    this.addUserForm.markAllAsTouched();
    const existingUser: any = this.usersService.allUsers?.filter(name => name.firstName == this.addUserForm.value.firstName);
    if (existingUser?.length > 0) {
      alert('User already Exist');
      return;
    }
    if (this.addUserForm.invalid) {
      return;
    }
    if (!this.isUserExist()) {
      const selectedUser: User = {
        firstName: this.addUserForm.value.firstName,
        lastName: this.addUserForm.value.lastName,
        phoneNumber: this.addUserForm.value.phoneNumber,
        address: this.addUserForm.value.address,
        email: this.addUserForm.value.email,
        id: uuid()
      };
      this.usersService.addUser(selectedUser);
      this.addUserForm.reset();
      this.router.navigateByUrl('/users');// After saving, navigating to dashboard
    }
    else {
      alert('User already Exist');
    }
  }
  isUserExist(): boolean {
    const existRecord = this.usersService.allUsers?.filter(user => user.firstName == this.addUserForm.value.firstName && user.id != this.addUserForm.value.id);
    return existRecord?.length ? true : false;
  }
  updateUser() {
    this.addUserForm.markAllAsTouched();
    if (this.addUserForm.invalid) {
      return;
    }
    if (!this.isUserExist()) {
      let selctedUserIndex = this.usersService.allUsers?.findIndex((user: User) => user.id == this.selectedUserData?.id);
      if (selctedUserIndex != undefined && selctedUserIndex != null && selctedUserIndex > -1) {
        this.usersService.allUsers?.splice(selctedUserIndex, 1, this.addUserForm.value);
      }
      this.router.navigate(['/users']);
    } else {
      alert('User already Exist');
    }
  }

  backToUserlist() {
    history.back();
  }
}
