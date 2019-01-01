require('dotenv').config();
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

//Passport config
require("./config/passportStrategy")(passport);

//Mongo config
const db = process.env.MONGO_URI;
mongoose.connect(db, {useNewUrlParser:true} )
  .then(()=>console.log("mongo connected"))
  .catch(err=> console.log(err))
//EJS setup
app.use(expressLayouts);
app.set("view engine", 'ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}))

//express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//connect flash, messages
app.use(flash());
//global vars for flash messages
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
})

//Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))



const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> console.log(`App started on port ${PORT}`))