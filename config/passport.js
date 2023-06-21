const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../models/Users');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) =>{
            //Match User
            User.findOne({ email: email })
             .then(user => {
                if(!user) {
                    return done(null, false, {messages: 'That email is not registered'});
                }
             
             //Match Password
             bcrypt.compare(password, user.password, (err, isMatch) =>{
                if(err) throw err;

                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password incorrect' });
                }
             });
            
            
            
            })
             .catch(err => console.log(err));
        })
    );

    
// Assuming you have imported the User model and have access to it

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err, null);
      });
  });
  

}