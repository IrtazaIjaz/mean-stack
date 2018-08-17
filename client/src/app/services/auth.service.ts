import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable() 
export class AuthService {

  authToken;
  user;
  options;
  domain= "http://localhost:8080/";

  constructor(private _http: Http) {

  }

  createAuthenticationHeaders() {
     this.loadToken();
     this.options = new RequestOptions({
       headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': this.authToken
       })
     });
  }

  loadToken() {
    const token= localStorage.getItem('token');
    this.authToken = token;
  }

   registerUser(user) {
    return this._http.post(this.domain + 'authentication/register', user).map(res => res.json());
   }

  //  saveBlogPost(data) {
  //   return this._http.post(this.domain + '/blogs/newBlog', data).map(res => res.json());
  //  }

   checkUsername(username) {
    return this._http.get(this.domain + 'authentication/checkUsername/'+ username).map(res => res.json());
   }

   checkEmail(email) {
    return this._http.get(this.domain + 'authentication/checkEmail/'+ email).map(res => res.json()); 
   }

   login(user) {
     return this._http.post(this.domain + 'authentication/login', user).map(res => res.json());
   }

   logout() {
     this.authToken= null;
     this.user= null;
     localStorage.clear();
   }

   storeUserData(token, user) {
      localStorage.setItem('token' , token);
      localStorage.setItem('user' , JSON.stringify(user));
      this.authToken = token;
      this.user = user;
   }

   getProfile() {
    this.createAuthenticationHeaders();
    return this._http.get(this.domain+ 'authentication/profile', this.options).map(res => res.json());
   }

   loggedIn() {
     return tokenNotExpired();
   }

}
