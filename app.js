
    var AWS = require('aws-sdk');
    var express = require('express');
    var bodyParser = require('body-parser');
    var mysql = require('mysql');

    AWS.config.region = process.env.REGION
    

var connection = mysql.createConnection({
  host     : 'dientoandammaynhom20.clpluyptqi3c.us-east-1.rds.amazonaws.com',
  user     : 'root',
  password : '123456789',
  port     : 3306,
  database : 'DataNews'
});
connection.connect(function(err) {
            if (err) {
              console.log('Database connection failed: ' + err.stack);
              return;
            }
            console.log('Connected to database.');
          });
          
var type = [];
connection.query("SELECT * FROM type",function(err,result,fields){
  if(err) throw err;
  type=result;
})

    var app = express();

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json())


    app.get('/', function(req, res) {
        var mess = [];   
        connection.query("SELECT * FROM news", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
              res.render('home', {
                static_path: 'static',
                theme: process.env.THEME || 'flatly',
                flask_debug: process.env.FLASK_DEBUG || 'false',
                mess : result,
                type : type
            });     
        })     
    });

    app.get('/types/:type', function(req, res) {
      var mess = [];   
      connection.query("SELECT * FROM news where type like (select name from type where idtype ="+ req.params.type+")", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(result)
            // res.render('home', {
            //   static_path: 'static',
            //   theme: process.env.THEME || 'flatly',
            //   flask_debug: process.env.FLASK_DEBUG || 'false',
            //   mess : result,
            //   type : type
          // });     
      })     
  });

    app.get('/news/:id', function(req, res) {
      var mess = [];   
      connection.query("SELECT * FROM news where idnews="+ req.params.id, function (err, result, fields) {
          if (err) throw err;
          console.log(result);
          res.send(result)
            // res.render('home', {
            //   static_path: 'static',
            //   theme: process.env.THEME || 'flatly',
            //   flask_debug: process.env.FLASK_DEBUG || 'false',
            //   mess : result,
            //   type : type
          // });     
      })     
  });
    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });