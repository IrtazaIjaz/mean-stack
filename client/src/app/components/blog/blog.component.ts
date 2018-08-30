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
  commentForm: FormGroup;
  loadingBlogs=false;
  processing=false;
  username;
  blogPosts;
  enabledComments=[];
  newComment=[];

  constructor(private formBuilder: FormBuilder, private _router: Router, private _auth: AuthService, private _blog: BlogService ) { 
    this.createNewBlogForm();
    this.createCommentForm();
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
  
  disableCommentForm() {
    this.commentForm.get('comment').disable();
  }
  enableCommentForm() {
    this.commentForm.get('comment').enable();
  }

  enableForm() {
    this.form.controls['title'].enable();
  }

  onBlogSubmit() {
    this.processing=true;
    // this.disableCommentForm();

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
        this.getAllBlogs();
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
    
    this.getAllBlogs();
  }

  newBlogForm() {
    this.newPost=true; 
  }
  readBlogs() {
    this.loadingBlogs=true;
    this.getAllBlogs();
    setTimeout(() => {
      this.loadingBlogs=false;
    }, 4000);
  }

  goBack() {
    window.location.reload();
  }

  getAllBlogs() {
    this._blog.getAllBlogs().subscribe( data => {
      this.blogPosts = data.blogs;
    });
  }

  draftComment(id) {
    this.commentForm.reset();
    this.newComment=[];
    this.newComment.push(id);
  }
  postComment(id) {
      this.disableCommentForm();
      this.processing= true;
      const comment = this.commentForm.get('comment').value;
      this._blog.postComment(id, comment).subscribe( data =>{
        this.getAllBlogs();
        const index = this.newComment.indexOf(id);
        this.newComment.splice(index,1);
        this.enableCommentForm();
        this.commentForm.reset();
        this.processing=false;
        if(this.enabledComments.indexOf(id) < 0 ) this.expand(id);
      });
  }
  cancelSubmission(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index,1);
    this.commentForm.reset();
    this.enableCommentForm();
     this.processing=false;
  }

  expand(id) {
    this.enabledComments.push(id);
  }

  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index,1);
  }

  likeBlog(id) {
    this._blog.likeBlog(id).subscribe( data =>{
      this.getAllBlogs();
    });
  }

  dislikeBlog(id) {
    this._blog.dislikeBlog(id).subscribe( data =>{
      this.getAllBlogs();
    });
  }

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    });
  }





}
