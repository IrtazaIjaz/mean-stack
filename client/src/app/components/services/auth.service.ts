import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  domain= "http://localhost:8080";

  constructor(private _http: Http) {

   }

   registerUser(user) {
    return this._http.post(this.domain + '/authentication/register', user).map(res => res.json());
   }

}
