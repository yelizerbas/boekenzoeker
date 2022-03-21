// Hier word alles opgehaald wat nodig is voor BookBuddy
require('dotenv').config();

const express = require('express');
const app = express();
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
// const myData = require('./data/data.json');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const dbSleutel = process.env.MONGO_URI;

// Regelt connectie met database
mongoose.connect(dbSleutel, { useNewURLParser: true })
    .then(() => console.log('Database is geconnect'))
    .catch(err => console.log(err));

// Schema word opgehaald uit het mapje models
const User = require('./models/User');

// Regelt connectie met database via config/connect.js
// const connectDB = require('./config/connect');
// connectDB();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/static', express.static('static'));

app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({
    extended: true,
}));

// Signup
// Source https://soufiane-oucherrou.medium.com/user-registration-with-mongoose-models-81f80d9933b0
app.post('/accountaangemaakt', (req, res) => {
    try {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                // Wanneer er al een gebruiker is met dit emailadres
                return res.status(400).json({ email: 'Er is al een gebruiker met dit emailadres.' });
            } else {
                // Wanneer er nog geen account is met dit emailadres dan wordt er een nieuw account aangemaakt
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    confirmpassword: req.body.confirm_password,
                });

                // console.log(newUser.name)
                newUser.save();
                // return res.status(200).json({newUser})
                return res.redirect('/account');
            }
        });
    } catch (error) {
        throw new Error(error);
    }
});

// Login
// Resource https://www.youtube.com/watch?v=pzGQMwGmCnc
app.post('/ingelogd', (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        User.findOne({ email: email, password: password }, function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).send();
            }

            if (!user) {
                return res.status(404).send();
            }

            // return res.status(200).send();
            return res.redirect('/account');
        });
    } catch (error) {
        throw new Error(error);
    }
});

// Account aanpassen
app.post('/aangepast', async (req, res) => {
    try {
        User.findOneAndUpdate({ name: 'Ine' }, { name: 'Henk' });
        const dataUser = await User.find({ name: 'Ine' }).lean();
        res.render('account', { data: dataUser });
    } catch (error) {
        throw new Error(error);
    }
});

// const data = JSON.parse(JSON.stringify(myData));
// const people = data.people;
// console.log(people[0].name)

// Pagina's ophalen
app.get('/', (req, res) => {
    res.render('home', { title: 'BookBuddy' });
});

app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Signup - BookBuddy' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login - BookBuddy' });
});

app.get('/account', async (req, res) => {
    try {
        const dataUser = await User.find({ name: 'Ine' }).lean();
        res.render('account', { data: dataUser[0], title: 'Account - BookBuddy' });
        console.log(dataUser);
    } catch (error) {
        throw new Error(error);
    }
});

// app.get('/ingelogd', (req, res) => {
//     res.render('ingelogd', {title: 'Ingelogd - BookBuddy'});
// });

// 404 pagina laden als de pagina niet bestaat
app.use((req, res) => {
    res.status(404).send('404 page not found');
});

// Localhost opstarten
app.listen(PORT, () => {
    console.log('app running on port', PORT);
});
