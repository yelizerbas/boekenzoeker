
/* eslint-disable no-undef */

require('dotenv').config()

const express = require('express');
const { engine } = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('express-flash');
const bcrypt = require('bcryptjs'),
    Q = require('q');

const funct = require('./functions.js');

const app = express();

// MongoDB connectie informatie

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongodbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.weqjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// PASSPORT

// Passport sessie.
passport.serializeUser( (user, done) => {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  console.log("deserializing " + obj);
  done(null, obj);
});


// Gebruik de LocalStrategy in Passport om gebruikers in te loggen/ te registreren.
passport.use('local-signin', new LocalStrategy(
  {passReqToCallback : true}, //Request naar Callback
  (req, username, password, done) => {
    funct.localAuth(username, password)
    .then( (user) => {
      if (user) {
        console.log("LOGGED IN AS: " + user.username);
        req.session.success = 'Je bent succesvol ingelogd ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT LOG IN");
        req.session.error = 'Kon gebruiker niet inloggen.'; //iGebruiker word geinformeerd dat hij/zij niet kan inloggen
        return done(null, false, {message: 'Verkeerde gebruikersnaam of wachtwoord'})
      }
    })
    .fail((err) => {
      console.log(err.body);
    });
  }
));

// Gebruik de LocalStrategy in Passport om gebruikers in te loggen/ te registreren.
passport.use('local-signup', new LocalStrategy(
  {passReqToCallback : true}, //Request naar Callback
  (req, username, password, done) => {
    funct.localReg(username, password)
    .then( (user) => {
      if (user) {
        console.log("REGISTERED: " + user.username);
        req.session.success = 'Je bent succesvol geregistreerd en ingelogt. ' + user.username + '!';
        done(null, user);
      }
      if (!user) {
        console.log("COULD NOT REGISTER");
        req.session.error = 'Gebruikersnaam al in gebruik kies een andere en probeer opnieuw'; //
        return done(null, false, {message: 'Gebruikersnaam bestaat al'})
      }
    })
    .fail( (err) => {
      console.log(err.body);
    });
  }
));

// EXPRESS
// Express Configureren
app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash())
app.use(methodOverride('_method'));
app.use(session({secret: 'process.env.SESSION_SECRET', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// // Session-persisted message middleware
app.use( (req, res, next) => {
  const err = req.session.error,
      msg = req.session.notice,
      success = req.session.success;

      delete req.session.error;
      delete req.session.success;
      delete req.session.notice;

      if (err) res.locals.error = err;
      if (msg) res.locals.notice = msg;
      if (success) res.locals.success = success;

      next();
});

app.use((req, res, next) => {
  app.locals.success = req.flash('success')
  next();
});

// Handlebars instellen
app.engine('hbs', engine({
  layoutsDir: `${__dirname}/views/layouts/`,
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: `${__dirname}/views/partials`

  }));

app.set('view engine', 'hbs');

//===============ROUTES===============

//Homepagina laten zien
app.get('/', (req, res) => {
  if ( !req.isAuthenticated() ) {
    res.redirect('/login')
    return
  }
  res.render('main', {user: req.user});
});

//Log-in pagina laten zien
app.get('/login', (req, res) => {

  res.render('login');

});


//Registreer pagina laten zien
app.get('/register', (req, res) => {

  res.render('register');
});

// Laat de gebruiker zijn/haar account verwijderen
app.post("/", async (req, res) => {

  await client.connect()



  client.db('Accounts').collection('AllAccounts').deleteOne({ username: req.body.delete })


  res.redirect('/login')

});



// Verzendt het verzoek via de lokale aanmeldingsstrategie, en als dit lukt, wordt de gebruiker naar de startpagina geleid, anders keert hij terug naar de aanmeldingspagina
app.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/register',
  failureFlash: true
  })
);

// Verzendt het verzoek via de lokale aanmeldingsstrategie, en als dit lukt, wordt de gebruiker naar de startpagina geleid, anders keert hij terug naar de aanmeldingspagina
app.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
  })
);

// Account aanpassen
app.post('/update', async (req, res) => {
  await client.connect();
  client.db('Accounts').collection('AllAccounts').findOneAndUpdate({ 
    name:req.user.username 
  }, { 
    name:req.body.username 
  }, {
    new: true,
    upsert: true 
  }, (err, data) => {
    if(err){
        console.log(err);
    }
    else{
        console.log('name updated');
    }
  });
  // Source https://jasonwatmore.com/post/2020/07/20/nodejs-hash-and-verify-passwords-with-bcrypt
  const hash = bcrypt.hashSync(req.body.password, 10);
  client.db('Accounts').collection('AllAccounts').findOneAndUpdate({ password:req.user.password }, { password:hash }, { new: true }, (err, data) => {
      if(err){
          console.log(err);
      }
      else{
          console.log('password updated');
      }
  });
  res.redirect('/');
});

// Logt de gebruiker uit van de site.
app.get('/logout', (req, res) => {
  const name = req.user.username;
  console.log("Uitloggen " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "Succesvol uitgelogd " + name + "!";
});

//error handling






//===============POORT=================
const port = process.env.PORT || 3000; //kies je poortnummer
app.listen(port);
console.log("listening on " + port + "!");
