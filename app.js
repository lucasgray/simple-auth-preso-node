
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var cors = require('express-cors')

app.use(cors({
  allowedOrigins: ['localhost:4200'],
  headers: ['Authorization']
}))

app.post('/token', function (request, response) {

  var u = request.body.username
  var p = request.body.password

  if (u === 'lucas' && p === 'password') {
    console.log('you win')
    response.send({
      "access_token":"2YotnFZFEjr1zCsicMWpAA",
      "token_type":"example",
      "expires_in":3600,
      "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
      "example_parameter":"example_value"
    })
  } else {
    response.sendStatus(401)
  }
});

app.get('/api/v1/teams', function(req,res) {

  console.log(req.header('Authorization'))
  const isCurrent = req.query.isCurrent === 'true'

  //pretend we're checking the authorization code. ya right
  //we could either use this Bearer token as a key to find who the user is from our db,
  //or JWT/JWE to decrypt it and skip the db.
  if (req.header('Authorization') === 'Bearer 2YotnFZFEjr1zCsicMWpAA') {

    if (isCurrent) {
      console.log('asking for current teammate')

      res.send({
        team: {
          id: 3,
          name: "Lucas Gray",
          specialty: "Crappy NodeJS code",
          isCurrent: true
        }
      })

    } else {
      console.log('asking for teammates')

      res.send({
        teams: [
          {
            id: 1,
            name: "Ron Burgundy",
            specialty: "Smelling of rich mahogany",
            isCurrent: false
          },
          {
            id: 2,
            name: "Harry Potter",
            specialty: "Spellz",
            isCurrent: false
          }
        ]
      })
    }
  } else {
    res.sendStatus(401)
  }
});

app.post('/googleToken', function(req,res) {

  console.log("boy howdy")

  // send code to Google for validation

  request.post({url:'https://www.googleapis.com/oauth2/v4/token', json: true, form: {
    code: req.body.authorization_code,
    client_id: '729980423791-94g355q4vhedkfdqrsrgmulk3fu6jsuu.apps.googleusercontent.com',
    client_secret: 'rvQksoOivPilgmfCm8fEfhoH',
    redirect_uri:'http://localhost:4200/oauth2callback',
    grant_type:'authorization_code'}
  }, function(error, response, body) {

    if (error) {
      return console.error('turning in code failed, ', err);
    }
    console.log('Got access token! ', body.access_token);

    //get access token/refresh token using code
    request({url: 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + body.access_token, json: true }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('\tGoogle Token Valid');
        var userId = body.user_id;
        var userEmail = body.email;

        console.log(userId);
        console.log(userEmail);

        //lets pretend we do stuff here
        //save off the access token/refresh token we got from google
        //if we havent seen the email before, new user, otherwise, update current user

        res.send({
          "access_token":"2YotnFZFEjr1zCsicMWpAA",
          "token_type":"example",
          "expires_in":3600,
          "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
          "example_parameter":"example_value"
        });
      } else {
        console.log('\tFailed to validate Google Token');
        res.send({});
      }
    });

  });

});

app.listen(4201);