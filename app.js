
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

  console.log(u);
  console.log(p);

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

  if (req.header('Authorization') === 'Bearer 2YotnFZFEjr1zCsicMWpAA') {
    res.send({
      teams: [
        {
          id: 1,
          name: "Ron Burgundy",
          specialty: "Pine"
        },
        {
          id: 2,
          name: "Rick James",
          specialty: "Music?"
        }
      ]
    })
  } else {
    res.sendStatus(401)
  }
})

app.listen(4201);