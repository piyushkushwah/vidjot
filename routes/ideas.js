const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helper/auth');
//load ideas odel
require('../models/Idea');
const Ideas = mongoose.model('ideas');



// Index Page 
router.get('', ensureAuthenticated,(req, res) => {
    Ideas.find({user:req.user.id})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('./ideas/index', {
                ideas: ideas
            });
        })
});

//add Idea form
router.get('/add', ensureAuthenticated,(req, res) => {
    
    res.render("ideas/add");
    

});

//Edit Idea Form 
router.get('/edit/:id',ensureAuthenticated,(req, res) => {
    Ideas.findOne({
        _id: req.params.id
    }).then(idea => {
        if(idea.user!=req.user.id){
            req.flash('error_msg','Not Authorized');
            res.redirect('/ideas');
        }else{
        res.render("ideas/edit", {
            idea: idea
        });
        }
    });
});

//Process form 
router.post('', (req, res) => {
    const errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' });
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });

    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user:req.user.id
        }
        new Ideas(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg','Video Idea Added');
                res.redirect('/ideas');
            })
    }
  
});

//Edit form Put request
router.put('/:id', (req, res) => {
    Ideas.findOne({
        _id: req.params.id
    }).then(idea => {

        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea => {
                req.flash('success_msg','Video Idea Updated');
                res.redirect('/ideas');
            }).catch(err=>{
                console.log(err);
            });
    });
});

//Delete Idea
router.delete('/:id', (req, res) => {
    Ideas.findByIdAndDelete({
        _id: req.params.id
    }).then(idea => {
        req.flash('success_msg','Video Idea Removed');
        res.redirect('/ideas');
    }).catch(err => {
        console.log(err);
    });
});

module.exports = router