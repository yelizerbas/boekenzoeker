// Source: https://github.com/WebDevSimplified/Nodejs-Passport-Login
const localStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const  User  = require('./models/User');


module.exports = function (passport) {

    passport.use(
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            User.findOne({
                email: email
            }).then(async user => {
                if (!user) {
                    console.log('email not found')
                    return done(null, false, { message: 'Het emailadres dat is ingevuld is niet geregistreerd' });
                }

                const match = await bcrypt.compare(password, user.password);
                
                if (match) {
                    return done(null, user);
                } else {
                    console.log('password incorrect');
                    return done(null, false, { message: 'Het wachtwoord dat is ingevuld is niet correct' });
                }
            });
        })
    );

    passport.serializeUser((user, done) =>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done) =>{
        User.findById(id,  (err, user) =>{
            done(err, user);
        });
    })
};