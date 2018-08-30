import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import { AuthService } from './auth.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
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

 editBlog(blog) {
  this.createAuthenticationHeaders();
  return this._http.put(this.domain+ 'blogs/updateBlog',blog, this.options).map(res => res.json());
 }

 getAllBlogs() {
   this.createAuthenticationHeaders();
   return this._http.get(this.domain+ 'blogs/allBlogs',this.options).map( res => res.json());
 }

 getSingleBlog(id) {
  this.createAuthenticationHeaders();
  return this._http.get(this.domain+ 'blogs/singleBlog/'+id, this.options).map(res => res.json());
 }

 deleteBlog(id) {
  this.createAuthenticationHeaders();
  return this._http.delete(this.domain + 'blogs/deleteBlog/'+ id, this.options).map(res => res.json());
 }

 likeBlog(id) {
  const blogData ={ id: id };
  return this._http.put(this.domain+ 'blogs/likeBlog', blogData , this.options).map(res => res.json());
 }

 dislikeBlog(id) {
  const blogData ={ id: id };
  return this._http.put(this.domain+ 'blogs/dislikeBlog', blogData , this.options).map(res => res.json());
 }

 postComment(id, comment) {
  this.createAuthenticationHeaders();
  const blogData= {
    id: id,
    comment: comment
  }
  return this._http.post(this.domain+ 'blogs/comment', blogData, this.options).map( res => res.json());
 }

}
