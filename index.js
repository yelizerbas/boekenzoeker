/* eslint-disable no-undef */

require('dotenv').config()

const express = require('express');
const {
  engine
} = require('express-handlebars');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('express-flash');
const bcrypt = require('bcryptjs')
const multer = require('multer');
const {
  utilsDB
} = require('./utils/db')

require('./functions.js')(passport);

const app = express();
const upload = multer();



// MongoDB connectie informatie

// Schema word opgehaald uit het mapje models
const User = require('./models/User');

const mongoose = require('mongoose');

// PASSPORT

// Passport sessie.
passport.serializeUser((user, done) => {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  console.log("deserializing " + obj);
  done(null, obj);
});


// Gebruik de LocalStrategy in Passport om gebruikers in te loggen/ te registreren.
passport.use('local-signin', new LocalStrategy({
    passReqToCallback: true
  }, //Request naar Callback
  (req, username, password, done) => {
    funct.localAuth(username, password)
      .then((user) => {
        if (user) {
          console.log("LOGGED IN AS: " + user.username);
          req.session.success = 'Je bent succesvol ingelogd ' + user.username + '!';
          done(null, user);
        }
        if (!user) {
          console.log("COULD NOT LOG IN");
          req.session.error = 'Kon gebruiker niet inloggen.'; //iGebruiker word geinformeerd dat hij/zij niet kan inloggen
          return done(null, false, {
            message: 'Verkeerde gebruikersnaam of wachtwoord'
          })
        }
      })
      .fail((err) => {
        console.log(err.body);
      });
  }
));

// Gebruik de LocalStrategy in Passport om gebruikers in te loggen/ te registreren.
passport.use('local-signup', new LocalStrategy({
    passReqToCallback: true
  }, //Request naar Callback
  (req, username, password, done) => {
    funct.localReg(username, password)
      .then((user) => {
        if (user) {
          console.log("REGISTERED: " + user.username);
          req.session.success = 'Je bent succesvol geregistreerd en ingelogt. ' + user.username + '!';
          done(null, user);
        }
        if (!user) {
          console.log("COULD NOT REGISTER");
          req.session.error = 'Gebruikersnaam al in gebruik kies een andere en probeer opnieuw'; //
          return done(null, false, {
            message: 'Gebruikersnaam bestaat al'
          })
        }
      })
      .fail((err) => {
        console.log(err.body);
      });
  }
));

// EXPRESS
// Express Configureren
app.use(express.urlencoded({
  extended: false
}));
// Regelt connectie met database
mongoose.connect(mongodbUrl, {
    useNewURLParser: true
  })
  .then(() => console.log('Database is geconnect'))
  .catch(err => console.log(err));

// EXPRESS
// Express Configureren
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(upload.array());

app.use(flash())
app.use(methodOverride('_method'));
app.use(session({
  secret: 'process.env.SESSION_SECRET',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

// // Session-persisted message middleware
app.use((req, res, next) => {
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

utilsDB(client).then(data => {
  console.log(data)
})

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
app.get('/account', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
    return
  }
  res.render('account', {
    user: req.user
  });
});

//Log-in pagina laten zien
app.get('/login', (req, res) => {

  res.render('login');

});


//Registreer pagina laten zien
app.get('/register', (req, res) => {

  res.render('register');
});

// Logt de gebruiker uit van de site.
app.get('/logout', (req, res) => {
  const name = req.user.username;
  console.log("Uitloggen " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "Succesvol uitgelogd " + name + "!";
});

//FILTEREN
app.get("/", async (req, res) => {

  // Data uit de database wat in een array is gestopt wordt nu in de constante "boeken"gezet
  const boeken = await utilsDB(client);
  // Ophalen boeken database
  res.render("main", {
    boeken: boeken
  });
});


app.post("/formulier", async (req, res) => {

  const boeken = await utilsDB(client);

  console.log(req.body);
  // Filter boeken
  const filteredBoeken = boeken.filter((boeken) => {
    // Stop het item alleen in de array wanneer onderstaande regel 'true' is, dus als de doelen overeen komen met de radiobutton
    return boeken.genre == req.body.genre;
  });
  //render zelfde pagina, maar met de gefilterde boeken
  res.render("main", {
    boeken: filteredBoeken
  });
});

// PASSPORT
// Passport sessie.
passport.serializeUser((user, done) => {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  console.log("deserializing " + obj);
  done(null, obj);
});

//===============ROUTES===============

//Homepagina laten zien
app.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
    return
  }
  res.render('main', {
    user: req.user
  });
});

//Log-in pagina laten zien
app.get('/login', (req, res) => {

  res.render('login');

});


//Registreer pagina laten zien
app.get('/register', (req, res) => {

  res.render('register');
});

// like pagina laten zien
app.get('like', (req, res) => {
  res.render('like');
})

//favorites/dislike pagina laten zien
app.get('dislike', (req, res) => {
  res.render('dislike');
})

// Laat de gebruiker zijn/haar account verwijderen
app.post("/", async (req, res) => {

  await client.connect()

  client.db('Accounts').collection('AllAccounts').deleteOne({
    username: req.body.delete
  })
  client.db('Accounts').collection('AllAccounts').deleteOne({
    username: req.body.delete
  })

  res.redirect('/login')

});

app.post('/register', async (req, res) => {
  try {
    User.findOne({
      username: req.body.username
    }).then((user) => {
      if (user) {
        // Wanneer er al een gebruiker is met dit emailadres
        return res.status(400).json({
          username: 'Er is al een gebruiker met deze gebruikersnaam.'
        });
      } else {
        // Genereer hash password
        // Source https://jasonwatmore.com/post/2020/07/20/nodejs-hash-and-verify-passwords-with-bcrypt
        const hash = bcrypt.hashSync(req.body.password, 10);


        // Wanneer er nog geen account is met dit emailadres dan wordt er een nieuw account aangemaakt
        const newUser = new User({
          username: req.body.username,
          password: hash,

        });

        // Verzendt het verzoek via de lokale aanmeldingsstrategie, en als dit lukt, wordt de gebruiker naar de startpagina geleid, anders keert hij terug naar de aanmeldingspagina
        app.post('/register', passport.authenticate('local-signup', {
          successRedirect: '/',
          failureRedirect: '/register',
          failureFlash: true
        }));

        // Verzendt het verzoek via de lokale aanmeldingsstrategie, en als dit lukt, wordt de gebruiker naar de startpagina geleid, anders keert hij terug naar de aanmeldingspagina
        app.post('/login', passport.authenticate('local-signin', {
          successRedirect: '/',
          failureRedirect: '/login',
          failureFlash: true
        }));
        // console.log(newUser.name)
        newUser.save();
        // return res.status(200).json({newUser})
        return res.redirect('/login');
      }
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Login
app.post('/login', (req, res, next) => {
  let errors = [];
  passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/',
    failureRedirect: `/login?email=${req.body.email}`,
  })(req, res, next)
  errors.push({
    msg: 'email not found'
  })
});

// Logt de gebruiker uit van de site.
app.get('/logout', (req, res) => {
  const name = req.body.username;
  console.log("Uitloggen " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "Succesvol uitgelogd " + name + "!";
});

//===============POORT=================
const port = process.env.PORT || 3000; //kies je poortnummer
app.listen(port);
console.log("listening on " + port + "!");