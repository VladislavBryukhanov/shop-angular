import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactInfo, Credentials, User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public myProfile: User;
  constructor(private http: HttpClient) { }

  public signIn(credentials: Credentials) {
    this.http.post('sign_in', credentials)
      .subscribe(() => {
        this.me();
      });
  }

  public signUp(user: User, contactInfo: ContactInfo) {
    this.http.post('sign_up', { user, contactInfo })
      .subscribe(() => {
        this.me();
      });
  }

  public signOut() {
    this.http.get('sign_out')
      .subscribe(() => {
        this.myProfile = null;
      });
  }

  public me() {
    this.http.get('me')
      .subscribe((user: User) => {
        this.myProfile = user;
      });
  }
}
