import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  message;
  messageClass;
  processing=false;
  form;
  previousUrl;

  constructor(private forBuilder: FormBuilder, private _auth:AuthService, private _router: Router, private authGuard:AuthGuard ) { 
    this.createForm();
  }

  ngOnInit() {
    if(this.authGuard.redirectUrl) {
      this.messageClass= "alert alert-danger";
      this.message= "You must be logged in to view that page";
      this.previousUrl = this.authGuard.redirectUrl;
      this.authGuard.redirectUrl = undefined;

    }
  }


  createForm() {
    this.form= this.forBuilder.group({
      username: ['',Validators.required],
      password: ['', Validators.required]
    });
  }

  disableForm() {
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
  }
  enableForm() {
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
  }

  onLoginSubmit() {
    this.processing=true;
    this.disableForm();

    const user= {
      username: this.form.get('username').value,
      password: this.form.get('password').value,
    }

    this._auth.login(user).subscribe(data => {
      if(!data.success) {
        this.messageClass="alert alert-danger"; 
        this.message=data.message;
        this.processing=false;
        this.enableForm();
      }
      else {
        this.messageClass="alert alert-success"; 
        this.message=data.message;
        this.processing=true;
        this.disableForm();
        this._auth.storeUserData(data.token, data.user);

        setTimeout(() => {
          if(this.previousUrl) {
            this._router.navigate([this.previousUrl]);
          } else {
            this._router.navigate(['/dashboard']); 
          }
        }, 2000);
      }
    });

  }

}
