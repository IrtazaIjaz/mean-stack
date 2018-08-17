import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

    constructor(private _auth: AuthService, private _router: Router) {
    }

    canActivate() {
        if(this._auth.loggedIn()) {
            this._router.navigate(['/']);
            return false;
        } else {
            return true;
        }
    }
}