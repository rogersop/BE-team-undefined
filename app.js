const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const Twit = require('twit');

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


app.route('/').post((req,res,next)=> {

    let token = req.body.token;
    let secret = req.body.secret;

    const T = new Twit({
        consumer_key:         "al5LN8w9gWcirowNLtxPHtoyf",
        consumer_secret:       "rj0C0w5tiLFsvTx1ZeKxIrAd7LFR2Q5NN8nz1gul6YbzwV4ZJp",
        access_token:         token,
        access_token_secret:  secret,
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
   

    })

    T.get('/statuses/user_timeline', function(err, data, response){
      console.log('data', data);
      console.log('response', reponse)
      res.send(data);
    })

    res.send('Hello, connected to Do-more server!')
})




module.exports = app;