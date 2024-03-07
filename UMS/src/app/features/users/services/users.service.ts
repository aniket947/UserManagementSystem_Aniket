import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  allUsers: User[] | undefined = [];
  selectedUser: User = {
    firstName: "", lastName: "", address: "", email: "", phoneNumber: 0,
    id: ""
  };

  isReload: boolean = true;

  constructor(private httpClient: HttpClient) {

  }

  addUser(data: User) {
    this.allUsers?.push(data);
  }

  getAllUsers(): Observable<any> {// api call for getting stored users data from json file
    return this.httpClient.get('./assets/users.json');
  }
}
