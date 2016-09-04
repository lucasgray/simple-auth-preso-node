
var express = require('express');
var bodyParser = require('body-parser');
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
      console.log('asking for current teammate')

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
})

app.listen(4201);