
/* eslint-disable no-undef */

require('dotenv').config()

const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');

// MongoDB connectie informatie

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongodbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.weqjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// EXPRESS
// Express Configureren
app.use(express.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({secret: 'process.env.SESSION_SECRET', saveUninitialized: true, resave: true}));


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
  res.render('main');
});

//Log-in pagina laten zien
app.get('/login', (req, res) => {
  
  res.render('login');
  
});

//Registreer pagina laten zien
app.get('/register', (req, res) => {
  res.render('register');
});

//===============POORT=================
const port = process.env.PORT || 8000; //kies je poortnummer
app.listen(port);
console.log("listening on " + port + "!");

