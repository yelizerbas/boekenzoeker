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
const mongodbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.weqjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// Schema word opgehaald uit het mapje models
const User = require('./models/User');

const mongoose = require('mongoose');

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
  extended: true
}));
app.use(upload.array());
app.use(flash())
app.use(methodOverride('_method'));
app.use(session({
  secret: 'process.env.SESSION_SECRET',
  saveUninitialized: false,
  resave: false
}));
app.use(passport.initialize());
app.use(passport.session());
// utilsDB(client).then(data => { console.log(data)})

// Handlebars instellen
app.engine('hbs', engine({
  layoutsDir: `${__dirname}/views/layouts/`,
  extname: 'hbs',
  defaultLayout: 'index',
  partialsDir: `${__dirname}/views/partials`

}));

app.set('view engine', 'hbs');

//===============ROUTES===============

// app.post('/register', async (req, res) => {
//   try {
//       User.findOne({ username: req.body.username }).then((user) => {
//           if (user) {
//               // Wanneer er al een gebruiker is met dit emailadres
//               return res.status(400).json({ username: 'Er is al een gebruiker met deze gebruikersnaam.' });
//           } else {
//               // Genereer hash password
//               // Source https://jasonwatmore.com/post/2020/07/20/nodejs-hash-and-verify-passwords-with-bcrypt
//               const hash = bcrypt.hashSync(req.body.password, 10);

//               // Wanneer er nog geen account is met dit emailadres dan wordt er een nieuw account aangemaakt
//               const newUser = new User({
//                   username: req.body.username,
//                   password: hash,
//               });

//               // console.log(newUser.name)
//               newUser.save();
//               // return res.status(200).json({newUser})
//               return res.redirect('/login');
//           }
//       });
//   } catch (error) {
//       throw new Error(error);
//   }
// });

// Signup
// Source https://soufiane-oucherrou.medium.com/user-registration-with-mongoose-models-81f80d9933b0
app.post('/register', async (req, res) => {
  try {
    User.findOne({
      email: req.body.email
    }).then((user) => {
      if (user) {
        // Wanneer er al een gebruiker is met dit emailadres
        return res.status(400).json({
          email: 'Er is al een gebruiker met dit emailadres.'
        });
      } else {
        // Genereer hash password
        // Source https://jasonwatmore.com/post/2020/07/20/nodejs-hash-and-verify-passwords-with-bcrypt
        const hash = bcrypt.hashSync(req.body.password, 10);
        const verified = bcrypt.compareSync(req.body.confirm_password, hash);

        // Wanneer er nog geen account is met dit emailadres dan wordt er een nieuw account aangemaakt
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          confirmpassword: verified,
        });

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
    successRedirect: '/account',
    failureRedirect: `/login?email=${req.body.email}`,
  })(req, res, next)
  errors.push({
    msg: 'email not found'
  })
});

// Account aanpassen
app.post('/update', async (req, res) => {
  User.findOneAndUpdate({
    name: req.user.name
  }, {
    name: req.body.name
  }, {
    new: true
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('name updated');
    }
  });
  User.findOneAndUpdate({
    email: req.user.email
  }, {
    email: req.body.email
  }, {
    new: true
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('email updated');
    }
  });
  // Source https://jasonwatmore.com/post/2020/07/20/nodejs-hash-and-verify-passwords-with-bcrypt
  const hash = bcrypt.hashSync(req.body.password, 10);
  const verified = bcrypt.compareSync(req.body.confirm_password, hash);
  User.findOneAndUpdate({
    password: req.user.password
  }, {
    password: hash
  }, {
    new: true
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('password updated');
    }
  });
  User.findOneAndUpdate({
    confirmpassword: req.user.confirm_password
  }, {
    confirmpassword: verified
  }, {
    new: true
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('password updated');
    }
  });
  res.redirect('/account');
});

// Laat de gebruiker zijn/haar account verwijderen
app.post("/", (req, res) => {
  User.findOneAndDelete({
    email: req.body.delete
  }, (err) => {
    if (err) console.log(err);
    console.log("Successful deletion");
  });
  res.redirect('/login');
});

//FILTEREN
// app.post("/formulier", async(req, res) => {

//   const boeken = await utilsDB(client); 

//   console.log(req.body);
//   // Filter boeken
//   const filteredBoeken = boeken.filter((boeken) => {
//     // Stop het item alleen in de array wanneer onderstaande regel 'true' is, dus als de doelen overeen komen met de radiobutton
//     return boeken.genre == req.body.genre;
//   });
//   //render zelfde pagina, maar met de gefilterde boeken
//   res.render("main", {
//     boeken: filteredBoeken
//   });
// });

// app.get("/", async(req, res) => {

//   // Data uit de database wat in een array is gestopt wordt nu in de constante "boeken"gezet
//   const boeken = await utilsDB(client); 
//   // Ophalen boeken database
//   res.render("main", {
//     boeken: boeken
//   });
// });

//===============ROUTES===============

// Homepagina laten zien
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

// Account laten zien en data ophalen uit database
app.get('/account', (req, res) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login')
    return
  }

  res.render('account', {
    name: req.user.name,
    email: req.user.email,
    title: 'Account - BookBuddy'
  });
});

// Logt de gebruiker uit van de site.
app.get('/logout', (req, res) => {
  const name = req.body.email;
  console.log("Uitloggen " + req.user.email)
  req.logout();
  res.redirect('/');
  req.session.notice = "Succesvol uitgelogd " + name + "!";
});

// like pagina
app.get('/like', (req, res) => {
  res.render('like');
})

app.get('/favorites', (req, res) => {
  res.render('favorites');
})

// PASSPORT
// Passport sessie.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  })
});

//===============POORT=================
const port = process.env.PORT || 3000; //kies je poortnummer
app.listen(port);
console.log("listening on " + port + "!");