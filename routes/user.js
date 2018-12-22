const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

require('../models/User');
const User = mongoose.model('users'); 
 
//User Login Route 
router.get('/login',(req,res)=>{
    res.render('users/login');
})

//User Register Route
router.get('/register',(req,res)=>{
    res.render('users/register');
  
});
//User Logout 
 router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg',' Successfully Logged Out');
    res.redirect('/user/login');
  });


//Login Form POST
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/ideas',
        failureRedirect:'/user/login',
        failureFlash:true
    })(req,res,next);
  
});

//Register From Post
router.post('/register',(req,res)=>{
    const errors = [];
    if(!req.body.name){
        errors.push({text:'Please Add Title'});
    }
    if(req.body.password!==req.body.password2){
        errors.push({text:'Password Do Not Matched'});
    }
    if(req.body.password.length < 4){
        errors.push({text:'Please Enter Password Having At Least 4 Character'});
    }
    if(errors.length>0){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    }
    else{
        User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
            req.flash('error_msg',"Email already registered");
            res.redirect('/user/register');
            }
            else{
                const newUser = {
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                }
                
                
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash;
                        new User(newUser)
                        .save()
                        .then(user=>{
                            res.redirect('/user/login');
                        })
                    });
                });
                req.flash('success_msg','You Are Successfully Registered');
            }
        })
       
        
       
    }
 
});

module.exports = router