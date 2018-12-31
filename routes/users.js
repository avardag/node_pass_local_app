const express = require('express');
const router = express.Router();

//Login page
router.get("/login", (req, res)=>{
  res.send("Welcome to login")
})

//Register page
router.get("/register", (req, res)=>{
  res.send("Welcome to register")
})


module.exports =router;