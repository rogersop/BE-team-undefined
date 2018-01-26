const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const TwitterTokenStrategy = require('passport-twitter-token');
const expressJwt = require('express-jwt');
const request = require('request');

const config = {

    CONSUMER_KEY : "al5LN8w9gWcirowNLtxPHtoyf",
    CONSUMER_SECRET: "rj0C0w5tiLFsvTx1ZeKxIrAd7LFR2Q5NN8nz1gul6YbzwV4ZJp",
    ACCESS_TOKEN: "956486719737597952-Ig4vAK1ejhCaxsnc7SImpdeF3TxCq77",
    ACCESS_TOKEN_SECRET: "05zoJ9pRgHe79vOT3oJeKQ9unMyApSA9rAJIsplJQ3pEu"


}

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };

  app.use(cors(corsOption));
  app.use(bodyParser.json());


 function getTwitterDetails() {
    console.log('hello')
    passport.use(new TwitterTokenStrategy({
        consumerKey: config.CONSUMER_KEY,
        consumerSecret: config.CONSUMER_SECRET,
        includeEmail: true
      }), function(token, tokenSecret, profile, done) {
          
          console.log(profile);
      })
   

  
  }


var createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    }, 'my-secret',
    {
      expiresIn: 60 * 120
    });
  };
  
  var generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  };
  
  var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
  };

  var authenticate = expressJwt({
    secret: 'my-secret',
    requestProperty: 'auth',
    getToken: function(req) {
      if (req.headers['x-auth-token']) {
        return req.headers['x-auth-token'];
      }
      return null;
    }
  });



app.route('/').get((req,res,next)=> {

    res.send('Hello, connected to Do-more server!')
})

app.route('/auth/twitter/reverse')
  .post(function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
        consumer_key: config.CONSUMER_KEY,
        consumer_secret: config.CONSUMER_SECRET
      }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: e.message });
      }

      console.log('!!!!!!!REQUEST')
      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      console.log(jsonStr)
      res.send(JSON.parse(jsonStr));
    });
  });


  // app.route("/auth/twitter/getpage")
  //   .get((req,res,next) => {
  //       let token = req.query.token;
  //       console.log("***", token)
  //       request.get({
  //           url: `https://api.twitter.com/oauth/authenticate?oauth_token=${token}`
  //       }, function(err, r, body){
  //           const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
     
  //           res.send(bodyString);
  //       })
  //   })

  app.route('/auth/twitter')
  .get((req, res, next) => {
   
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: config.CONSUMER_KEY,
        consumer_secret: config.CONSUMER_SECRET,
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
        return res.send(500, { message: err.message });
      }
      
   
      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      console.log('STRING BODY!', bodyString);
      const parsedBody = JSON.parse(bodyString);
      console.log('JSON BODY', parsedBody);
    
      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;
    
      console.log("!!!" , req.body)
      next();
    });
  }, passport.authenticate('twitter-token', {session: false}), function(req, res, next) {
      if (!req.user) {
        return res.send(401, 'User Not Authenticated');
      }

      // prepare token for API
      req.auth = {
        id: req.user.id
      };

      return next();
}, generateToken, sendToken);

module.exports = app;