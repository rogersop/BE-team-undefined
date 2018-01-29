const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request');
const Twit = require('twit');

let CONSUMER_KEY = "al5LN8w9gWcirowNLtxPHtoyf";
let CONSUMER_SECRET = "rj0C0w5tiLFsvTx1ZeKxIrAd7LFR2Q5NN8nz1gul6YbzwV4ZJp";


var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
  };

  app.use(cors(corsOption));
  app.use(bodyParser.json());


app.route('/').post((req,res,next)=> {
  console.log('hello')
    console.log("REQ BODY", req.body)
   
    let token = req.body.token;
    let secret = req.body.secret;
    

    const T = new Twit({
        consumer_key:         CONSUMER_KEY,
        consumer_secret:      CONSUMER_SECRET,
        access_token:         token,
        access_token_secret:  secret,
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests. 
   

    })

    T.get('/statuses/home_timeline', function(err, data, response){
      // console.log('data', data);
     console.log(data[0])
      let arr = [];
      let usersInfo = data.map((user, i)=> {
        
        let obj = {};
         obj.name = user.user.name;
         obj.screen_name = user.user.screen_name;
         obj.text = user.text;
         obj.profile_image_url = user.user.profile_image_url;
         
         return obj;
        })

    
      console.log(usersInfo)
      res.send(usersInfo);
    })

    // res.send('Hello, connected to Do-more server!')
})




module.exports = app;