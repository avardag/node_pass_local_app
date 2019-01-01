const LocalStrategy = require("passport-local").Strategy;
const mongoose = require('mongoose'); //to check for user
const bcrypt = require("bcryptjs"); // to decrypt password


const User = require("../models/User");


module.exports = function(passport){
  passport.use(
    new LocalStrategy(
    {usernameField: "email"}, (email, password, done)=>{
    //check if there is a user with given email
    //Match user
    User.findOne({email:email})
    .then(user=>{
      if(!user){
        //move to next. null for errors, false for user
        return done(null, false, {message: 'That email is not registered'})
      }
      //if there is a user, match password
      bcrypt.compare(password, user.password, (err, isMatch)=>{
        if(err) throw err;
        if(isMatch){
          return done(null, user); // null for errors, user for user
        }else{ //passwords didnt match
          return done(null, false, {message: "Password is incorrect"})
        }
      })
      })
      .catch(err=> console.log(err))
  })
  )
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user.id); 
  // user.id is saved in the sesion, to later retrieve the whole object
  //via deserialize : req.session.passport.user = {id: '......'}
  });
  // used to deserialize the user
  passport.deserializeUser((id, done) =>{
     User.findById(id, (err, user) => {
        done(err, user);
        //user object attaches to the request as req.user
    });
  });

}