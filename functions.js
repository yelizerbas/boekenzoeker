const bcrypt = require('bcryptjs'),
  Q = require('q');

// Source: https://github.com/WebDevSimplified/Nodejs-Passport-Login
const localStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

module.exports = function (passport) {

  const {
    MongoClient,
    ServerApiVersion
  } = require('mongodb');
  const mongodbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.weqjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  });
  client.connect(err => {

    //perform actions on the collection object

  });

  //Word gebruikt in lokale gebruikersregistratie
  exports.localReg = (username, password) => {
    const deferred = Q.defer();

    MongoClient.connect(mongodbUrl, (err, db) => {
      const collection = client.db('Accounts').collection('AllAccounts');

      //check if username is already assigned in our database
      collection.findOne({
          'username': username
        })
        .then((result) => {

          if (null != result) {
            console.log("Gebruikersnaam al in gebruik:", result.username);
            deferred.resolve(false); // gebruikersnaam bestaat al




          } else {
            const hash = bcrypt.hashSync(password, 8);
            const user = {
              "username": username,
              "password": hash,



            }

            console.log("Gebruiker word aangemaakt:", username);

            collection.insert(user)
              .then(() => {
                db.close();
                deferred.resolve(user);
              });
          }
        });




    });



    return deferred.promise;
  };


  //Kijkt of de gebruiker bestaat
  //Als gebruiker bestaat checkt hij of de wachtwoorden matchen  // true waar 'hash' is password in DB)
  // Als het wachtwoord klopt word je gebracht naar de website 
  //Als het niet klopt word er naar de console gelogt dat het wachtwoord niet klopt.
  exports.localAuth = (username, password) => {
    const deferred = Q.defer();

    MongoClient.connect(mongodbUrl, (err, db) => {
      const collection = client.db('Accounts').collection('AllAccounts');

      collection.findOne({
          'username': username
        })
        .then((result) => {
          if (null == result) {
            console.log("Gebruikersnaam niet gevonden:", username);

            deferred.resolve(false);

          } else {
            const hash = result.password;

            console.log("Gebruiker gevonden: " + result.username);

            if (bcrypt.compareSync(password, hash)) {
              deferred.resolve(result);
            } else {
              console.log("Verkeerd wachtwoord");

              deferred.resolve(false);

            }
          }

          db.close();
        });
    });

    return deferred.promise;
  }

  passport.use(
    new localStrategy({
      usernameField: 'username'
    }, (username, password, done) => {
      User.findOne({
        username: username
      }).then(async user => {
        if (!user) {
          console.log('username not found')
          return done(null, false, {
            message: 'De gebruikersnaam die is ingevuld is niet geregistreerd'
          });
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
          return done(null, user);
        } else {
          console.log('password incorrect');
          return done(null, false, {
            message: 'Het wachtwoord dat is ingevuld is niet correct'
          });
        }
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  })
};