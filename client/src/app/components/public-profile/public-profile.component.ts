import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

  currentUrl;
  username;
  email;
  messageClass;
  message;
  profileFound = false;

  constructor(private _auth: AuthService, private _activatedRoute: ActivatedRoute) { }
    

  ngOnInit() {
    this.currentUrl = this._activatedRoute.snapshot.params;
    this._auth.getPublicProfile(this.currentUrl.username).subscribe( data =>{
      if(!data.success) {
        this.message= data.message;
        this.messageClass= "alert alert-danger";
      } else {
        this.profileFound = true;
        this.username = data.user.username;
        this.email = data.user.email;
      }

      
    });
  }

}
