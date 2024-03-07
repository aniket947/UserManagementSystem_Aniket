import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { v4 as uuid } from 'uuid';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ums-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  constructor(private usersService: UsersService, private router: Router) { }

  userList: User[] | undefined = [];
  allUserSubs: Subscription | undefined;

  ngOnInit(): void {
    if (this.usersService.isReload) {
      this.allUserSubs = this.usersService.getAllUsers().subscribe((resUserData: User[]) => {
        this.usersService.allUsers = this.mapUserData(resUserData);
        this.reloadUserList();
        this.usersService.isReload = false;
      });
    } else {
      this.reloadUserList();
    }
  }

  reloadUserList() {
    this.userList = this.usersService.allUsers;
  }

  mapUserData(data: User[] | undefined) {//Update unique id to each record
    return data?.map(rec => {
      rec.id = uuid()
      return rec;
    })
  }

  addUser() {
    this.usersService.selectedUser = {
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phoneNumber: undefined,
      id: "0"
    }
    this.router.navigateByUrl('/add-user');
  }

  editUser(data: User) {
    this.usersService.selectedUser = data;
    this.router.navigateByUrl('/add-user');
  }

  deleteUser(id: any) {
    const selctedUserIndex = this.usersService.allUsers?.findIndex((user: User) => user.id == id);
    if (selctedUserIndex != undefined && selctedUserIndex != null && selctedUserIndex > -1) {
      this.usersService.allUsers?.splice(selctedUserIndex, 1);
      alert('User deleted Succesfully');
    }
  }

  ngOnDestroy() {
    this.allUserSubs?.unsubscribe(); //unsubscribing get user api subscription
  }
}
