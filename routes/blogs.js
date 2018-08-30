const Blog= require('../models/blog');
const User= require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


module.exports = (router) => {

 router.post('/newBlog' , (req,res) =>{
     if(!req.body.title) {
         res.json({ success: false, message: 'Blog Title is required.'});
     } else if(!req.body.body) {
         res.json({ success: false, message: 'Blog body is required.' });
     }else if(!req.body.createdBy) {
        res.json({ success: false, message: 'Blog creator is required.' }); 
     } else {
        const blog= new Blog({
            title: req.body.title,
            body: req.body.body,
            createdBy: req.body.createdBy
        });
        blog.save((err) => {
            if(err) {
                if(err.errors) {
                    if(err.errors.title) {
                        res.json({ success: false, message: err.errors.title.message });
                    }
                    else if(err.errors.body) {
                        res.json({ success: false, message: err.errors.body.message });
                    }
                    else {
                        res.json({ success: false, err: err, message: err.errmsg});
                    }
                }
                res.json({ success: false, message:err });
            } else {
                res.json({ success: true, createdBy: req.body.createdBy, message:'Blog Saved' });
            }
        })
      
     }
 });

 router.get('/allBlogs', (req, res) => {
    Blog.find({}, (err, blogs) =>{
        if(err) {
            res.send({success: false, message: err});
        } else if(!blogs) {
            res.send({success: false, message: 'no Blog found'});
        }
        else {
            res.send({success: true, blogs: blogs });
        }
    }).sort({'_id': -1}); 
 });

 router.get('/singleBlog/:id', (req, res) => {
     if(!req.params.id) {
        res.send({success: false, message: 'No Blog ID was provided'});
     } else {
        Blog.find({_id: req.params.id}, (err, blog) => {
            if(err) {
                res.send({success:false, message: 'No valid Blog ID'});
            } else if(!blog) {
                res.send({success:false, message: 'Blog not Found'});
            } 
            else {
                User.findOne({_id: req.decoded.userId}, (err, user) =>{
                    if(err) {
                        res.send({success:false, message: err});        
                    } else if(!user) {
                        res.send({success:false, message: 'Unable to Authenticate user'});        
                    } else if(user.username !== blog[0].createdBy) {
                        res.send({success:false, message: 'You are not authorized to edit this blog'});        
                    }
                    else {
                        res.send({success:true, blog: blog});
                    }
                });
                
            }
        });
    }
 });

 router.put('/updateBlog', (req, res) => {
    if(!req.body._id) {
        res.json({success: false, message: 'No Blog ID provided'});
     } else {
        Blog.findOne({_id: req.body._id}, (err, blog) => {
            if(err) {
                res.json({success:false, message: 'Not a  valid Blog ID'});
            } else if(!blog) {
                res.json({success:false, message: 'Blog id was not Found'});
            }
            else {
                User.findOne({ _id: req.decoded.userId } , (err, user) =>{
                    if(err) {
                         res.json({success: false, message: err});
                    } else if(!user) {
                        res.json({success: false, message: 'Unable to authenticate user'});
                    } else if(user.username !== blog.createdBy ) {
                        res.json({success: false,User: user, Blog: blog,message: 'You are not authorized to edit'});
                        }
                        else {
                            blog.title= req.body.title,
                            blog.body= req.body.body;
                            blog.save((err) => {
                                if(err) {
                                    res.json({success: false, message: err});
                                } else {
                                    res.json({success: true, message: 'Blog Updated!'}); 
                                }
                            });
                        }
                    }
            )};
            
        });
    }
 });

 router.delete('/deleteBlog/:id', (req,res) => {
    if(!req.params.id) {
        res.json({success: false, message: 'ID is not provided'});
    } else {
        Blog.findOne({_id: req.params.id} , (err, blog) =>{
            if(err) {
                res.json({success: false, message: 'Invalid ID'});
            } else if(!blog) {
                res.json({success: false, message: 'Blog Not Found'});
            } 
            else {
                User.findOne({ _id: req.decoded.userId } , (err, user) =>{ 
                    if(err) {
                        res.json({success: false, message: err});
                    } else if(!user) {
                        res.json({success: false, message: 'Unable to Authenticate User'});
                    } else if(user.username !== blog.createdBy ) {
                        res.json({success: false, message: 'You are not authorized to edit'});
                        }
                      else {
                          blog.remove(err => {
                              if(err) {
                                res.json({success: false, message: err});
                              }
                              else {
                                res.json({success: true, message: 'Blog Deleted'});
                              }
                          });
                      }
                    
                });
            }
        });

    }

 });

 router.put('/likeBlog', (req,res) => {
    if(!req.body.id) {
        res.json({success: false, message: 'ID is not provided'});
    } else {
        Blog.findOne({_id: req.body.id}, (err, blog) =>{
            if(err) {
                res.json({success: false, message: 'Invalid Blog ID'});
            } else if(!blog) {
                res.json({success: false, message: 'Blog not Found'});
            } else {
                User.findOne({ _id: req.decoded.userId}, (err, user) =>{
                    if(err) {
                        res.json({success: false, message: 'Invalid Blog ID'});
                    } else if(!user) {
                        res.json({success: false, message: 'User not Found'});
                    } else if(user.username === blog.createdBy ) {
                        res.json({success: false, message: 'Cannot like your own post'});
                       } else if(blog.likedBy.includes(user.username)) {
                            res.json({success: false, message: 'You already liked this post'});
                      } else if(blog.dislikedBy.includes(user.username)) {
                            blog.dislikes--;
                            const arrayIndex = blog.dislikedBy.indexOf(user.username);
                            blog.dislikedBy.splice(arrayIndex , 1);
                            blog.likes++;
                            blog.likedBy.push(user.username);
                            blog.save(err =>{
                                if(err) {
                                    res.json({success: false, message: 'Something Went wrong'});
                                } else {
                                    res.json({success: true, message: 'Blog liked! '});
                                }
                            });
                      } else {
                            blog.likes++;
                            blog.likedBy.push(user.username);
                            blog.save(err =>{
                                if(err) {
                                    res.json({success: false, message: 'Something Went wrong'});
                                } else {
                                    res.json({success: true, message: 'Blog liked! '});
                                }
                            });
                      }
                });
            }
        });
    }
 });

//  Dislike API

router.put('/dislikeBlog', (req,res) => {
    if(!req.body.id) {
        res.json({success: false, message: 'ID is not provided'});
    } else {
        Blog.findOne({_id: req.body.id}, (err, blog) =>{
            if(err) {
                res.json({success: false, message: 'Invalid Blog ID'});
            } else if(!blog) {
                res.json({success: false, message: 'Blog not Found'});
            } else {
                User.findOne({ _id: req.decoded.userId}, (err, user) =>{
                    if(err) {
                        res.json({success: false, message: 'Invalid Blog ID'});
                    } else if(!user) {
                        res.json({success: false, message: 'User not Found'});
                    } else if(user.username === blog.createdBy ) {
                        res.json({success: false, message: 'Cannot Dislike your own post'});
                       } else if(blog.dislikedBy.includes(user.username)) {
                            res.json({success: false, message: 'You already disliked this post'});
                      } else if(blog.likedBy.includes(user.username)) {
                            blog.likes--;
                            const arrayIndex = blog.likedBy.indexOf(user.username);
                            blog.likedBy.splice(arrayIndex , 1);
                            blog.dislikes++;
                            blog.dislikedBy.push(user.username);
                            blog.save(err => {
                                if(err) {
                                    res.json({success: false, message: 'Something Went wrong'});
                                } else {
                                    res.json({success: true, message: 'Blog Disliked! '});
                                }
                            });
                      } else {
                        blog.dislikes++;
                            blog.dislikedBy.push(user.username);
                            blog.save(err => {
                                if(err) {
                                    res.json({success: false, message: 'Something Went wrong'});
                                } else {
                                    res.json({success: true, message: 'Blog Disliked! '});
                                }
                            });
                      }
                });
            }
        });
    }
 });

 router.get('/publicProfile/:username', (req, res) =>{
    if(!req.params.username) {
        res.json({ success: false, message: 'Username is not provided'});
    } else {
        User.findOne({ username: req.params.username}).select('username email').exec((err, user) => {
            if(err) {
                res.json({ success: false, message: 'Something Went Wrong'});
            } else if(!user) {
                res.json({ success: false, message: 'username not found'});
            } else {
                res.json({ success: true, user: user});
            }
        });
    }
 });

 router.post('/comment', (req, res) => {
    if(!req.body.comment) {
        res.json({success: false, message: 'No Comment provided'});
    } else if(!req.body.id) {
        res.json({success: false, message: 'No ID provided'});
    } else {
        Blog.findOne({_id: req.body.id}, (err, blog) =>{
            if(err) {
                res.json({success: false, message: 'Invalid Blog ID'});
            } else if(!blog) {
                res.json({success: false, message: 'Blog Not found'});
            } else {
                User.findOne({_id: req.decoded.userId}, (err,user)=> {
                    if(err) {
                        res.json({success: false, message: 'Something Went Wrong'});
                    } else if(!user) {
                        res.json({success: false, message: 'User not found'});
                    }
                    else {
                        blog.comments.push({
                            comment: req.body.comment,
                            commentator: user.username
                        });
                        blog.save((err) => {
                            if(err) {
                                res.json({success: false, message: 'Something Went Wrong'});
                            }
                            else {
                                res.json({success: true, message: 'Comments Saved'});
                            }
                        });
                    }
                });

            }
        })
    }

 });

 return router;
};