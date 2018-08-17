import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import { AuthService } from './auth.service';

@Injectable()
export class BlogService {

  options;
  domain= this._auth.domain;

  constructor(private _auth: AuthService, private _http: Http) { 

  }

  createAuthenticationHeaders() {
    this._auth.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
       'Content-Type': 'application/json',
       'authorization': this._auth.authToken
      })
    });
 }

 newBlog(blog) {
  this.createAuthenticationHeaders();
  return this._http.post(this.domain+ 'blogs/newBlog', blog, this.options).map( res => res.json());
 }

}
