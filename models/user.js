const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt= require('bcrypt-nodejs');
const Schema = mongoose.Schema;

// email validation
let emailLengthChecker = (email) =>{
  if(!email) {
    return false;
  }
  else if(email.length <5 || email.length>30) {
    return false;
  }
  else {
    return true;
  }
};

let validEmailChecker = (email) => {
  if(!email) {
    return false;
  }
  else {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
};

const emailValidators=[{

    validator: emailLengthChecker,
    message: 'E-mail must be at least 5 character but not more than 30'
  },
  {
    validator: validEmailChecker,
    message: 'Must be one uppercase, special character, number, lowercase '
  }
];
// email validation end

// password validation
let passwordLengthChecker = (password) =>{
  if(!password) {
    return false;
  }
  else if(password.length < 8 || password.length > 35) {
    return false;
  }
  else {
    return true;
  }
};

let validPasswordChecker = (password) => {
  if(!password) {
    return false;
  }
  else {
    const regExp = new RegExp (/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password);
  }
  
};

const PasswordValidators=[{

  validator: passwordLengthChecker,
  message: 'password must be at least 8 character but not more than 35'
},
{
  validator: validPasswordChecker,
  message: 'password Must be a one uppercase, lowercase, special character and number'
}
];
// password validation end

// username validation
let usernameLengthChecker = (username) =>{
  if(!username) {
    return false;
  }
  else if(username.length < 3 || username.length > 15) {
    return false;
  }
  else {
    return true;
  }
};

let validUsernameChecker = (username) => {
  if(!username) {
    return false;
  }
  else {
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username);
  }
};

const usernameValidators=[{

  validator: usernameLengthChecker,
  message: 'UserName must be at least 3 character but not more than 15'
},
{
  validator: validUsernameChecker,
  message: 'Must be a valid UserName'
}
];
// username validation end

const userSchema = new Schema({
  email   : {type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
  username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
  password: {type: String, required: true, validate: PasswordValidators}

});

userSchema.pre('save', function (next) {
  if(!this.isModified('password'))
  {
    return next();
  }
  bcrypt.hash(this.password,null,null, (err,hash) =>{
    if(err)
    {
        return next(err);
    }
    this.password=hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password) {
 return bcrypt.compareSync(password, this.password); 
};

module.exports = mongoose.model('User', userSchema);