const User = require('../models/user');
const Post = require('../models/post');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');

const { isLoggedIn } = require('../config/auth');


router.get('/', async (req, res) => {
    const allPost = await Post.find();
    res.render('home', { user:req.user,posts: allPost });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/register', (req, res) => {
    let errors=[];
    res.render('register',{errors});
});

router.post('/register', async (req, res) => {
    const { username, firstname, lastname, email, password } = req.body;
    let errors = [];

    if (!username || !firstname || !lastname || !email || !password) {
        errors.push({ msg: 'fill all the fields' });
    }

    if (password && password.length < 8) {
        errors.push({ msg: 'password can\'t be less than 8 characters' });
    }

    if (username && username.length < 3) {
        errors.push({ msg: 'username must be of atleast 3 characters' });
    }

    if (errors.length > 0) {
        res.render('register',
            {
                errors,
                username,
                firstname,
                lastname,
                email,
                password
            });
    }
    else {
        const newUser = new User({
            username,
            firstname,
            lastname,
            email,
            password
        })
        
        bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;

                newUser.save()
                    .then(user => {
                        req.flash('success', 'You are registered successfully.')
                        res.redirect('/login')
                    })
                    .catch(err => {
                        console.log(err);
                        if(err.keyPattern.email==1 && err.code==11000)
                            errors.push({ msg:"Email id already registered."});
                        if(err.keyPattern.username==1 && err.code==11000)
                            errors.push({ msg:"username is already taken. Try with different one."});
                        res.render('register',
                            {
                                errors,
                                username,
                                firstname,
                                lastname,
                                email,
                                password
                            });
                    });
            }))
    }

});

router.post('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;
