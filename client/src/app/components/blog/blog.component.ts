import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  messageClass;
  message;
  newPost=false;
  form: FormGroup;
  loadingBlogs=false;
  processing=false;
  username;

  constructor(private formBuilder: FormBuilder, private _router: Router, private _auth: AuthService, private _blog: BlogService ) { 
    this.createNewBlogForm();
  }

  createNewBlogForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
          this.alphaNumericValidation
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
    ])]
  //   ,
  //   comment: ['', Validators.compose([
  //     Validators.required,
  //     Validators.minLength(1),
  //     Validators.maxLength(200)
  // ])]
    });
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if(regExp.test(controls.value)) {
      return null;
    } else {
      return {'alphaNumericValidation': true};
    }
  }
  
  disableForm() {
    this.form.controls['title'].disable();
  }
  enableForm() {
    this.form.controls['title'].enable();
  }

  onBlogSubmit() {
    this.processing=true;
    this.disableForm();

    const blog= {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      createdBy: this.username
    }
    console.log(blog);
    this._blog.newBlog(blog).subscribe( (data) =>{
      if(!data.success) {
        this.messageClass = "alert alert-danger";
        this.message=data.message; 
        this.processing=false;
        this.enableForm();
      }
      else {
        this.messageClass = "alert alert-success";
        this.message=data.message; 
        setTimeout(() => {
          this.newPost=false;
          this.processing=false;
          this.message=false;
          this.form.reset();
          this.enableForm();
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this._auth.getProfile().subscribe(profile => {
      this.username= profile.user.username;
    });
  }

  newBlogForm() {
    this.newPost=true; 
  }
  readBlogs() {
    this.loadingBlogs=true;
    setTimeout(() => {
      this.loadingBlogs=false;
    }, 4000);
  }

  goBack() {
    window.location.reload();
  }

  draftComment() {
    
  }



}
