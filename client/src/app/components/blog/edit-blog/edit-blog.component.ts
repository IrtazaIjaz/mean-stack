import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';
import { BlogService } from '../../../services/blog.service';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  message;
  messageClass;
  currentUrl;
  blog;
  form: FormGroup;
  processing=false;
  loading = true; //in start it's false
  constructor(private _router: Router, private _location: Location,
     private _activate: ActivatedRoute, private _blog: BlogService) { 
  }

  ngOnInit() {
    this.currentUrl= this._activate.snapshot.params;
    this._blog.getSingleBlog(this.currentUrl.id).subscribe( (data:any) =>{
      if(!data.success) {
        this.messageClass = 'alert alert-danger'
        this.message = 'Blog not found';
      }
      else {
        this.loading= false; //if blog exist show data in fields
        this.blog=data.blog[0];
      }
    });
  }
  updateBlogSubmit() {
    this.processing =true;
    console.log(this.blog);
    this._blog.editBlog(this.blog).subscribe(data =>{
      if(!data.success) {
        this.messageClass =  'alert alert-danger';
        this.message = data.message;
        this.processing =false;
      }
      else {
        // this.processing = false;
        this.messageClass =  'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this._router.navigate(['/blog']);
        }, 2000);
      }
    });
    
  }

  goBack() {
    this._location.back();
  }

}

