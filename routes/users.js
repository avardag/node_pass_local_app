const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");

//Login page
router.get("/login", (req, res)=>{
  res.render("login")
})

//Register page
router.get("/register", (req, res)=>{
  res.render("register")
})

//Handle Register
router.post("/register", (req, res)=>{
  const { name, email, password, password2 } = req.body;
  let errors =[];
  //check required fields
  if (!name || !email || !password || !password2){
    errors.push({msg: "please fill in all fields"})
  }
  //check password match
  if (password !== password2){
    errors.push({msg: "passwords dont match"})
  }
  //check passowrd length
  if (password.length < 6){
    errors.push({msg: "Password must be at least 6 characters"})
  }
  if(errors.length > 0){
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    })
  }else{
    //passed validation
    User.findOne({email: email})
      .then(user=>{
        if(user){ //user exists
          errors.push({msg: "Email is already registered"})
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          })
        }else{
          const newUser = new User({
            name,
            email,
            password
          })
          //hash password
          bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
              if(err) throw err;
              //set password to hashed
              newUser.password = hash;
              //Save user
              newUser.save()
                .then(user=> res.redirect("/users/login"))
                .catch(err=> console.log(err))
            })
          })
        }
      })
  }
})

module.exports =router;