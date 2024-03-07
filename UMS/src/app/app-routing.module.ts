import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { UserUpsertComponent } from './features/users/components/user-upsert/user-upsert.component';

const routes: Routes = [
  { path: 'add-user', component: UserUpsertComponent },
  { path: 'users', component: UserListComponent },
  { path: '', component: UserListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
