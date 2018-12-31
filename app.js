require('dotenv').config();
const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();

//Mongo config
const db = process.env.MONGO_URI;
mongoose.connect(db, {useNewUrlParser:true} )
  .then(()=>console.log("mongo connected"))
  .catch(err=> console.log(err))
//EJS setup
app.use(expressLayouts);
app.set("view engine", 'ejs');

//Routes
app.use("/", require("./routes/index"))
app.use("/users", require("./routes/users"))



const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> console.log(`App started on port ${PORT}`))