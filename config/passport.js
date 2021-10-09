const LocalStrategy=require('passport-local');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

// Load User Model
const User=require('../models/user');

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField:'email' },(email,password,done) => {

            //find user
            User.findOne({ email:email })
            .then( (user) => {
                //console.log(user);
                if(!user)
                {
                    return done(null, false, {message: 'Username or password incorrect'});
                }

                //password match
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    
                    if(err) throw err;

                    if(isMatch)
                    {
                        return done(null, user);
                    }
                    else
                    {
                        return done(null, false, {message: 'Username or password incorrect'});
                    }
                });
            })
            .catch(err => console.log(err) );

        })
    );


    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
          done(err, user);
        });
      });
}