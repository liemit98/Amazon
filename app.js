
    var AWS = require('aws-sdk');
    var express = require('express');
    var path = require('path');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var mysql = require('mysql');

    AWS.config.region = process.env.REGION


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
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

var list = [];
connection.query("SELECT * FROM news",function(err,result,fields){
  if(err) throw err;
  list=result;
})

    var app = express();

    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json())
    app.use(express.static(path.join(__dirname, 'static')));
    app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

    //kiểm tra đăng nhập
    app.post('/auth', function(request, response) {
    	var username = request.body.username;
    	var password = request.body.password;
    	if (username && password) {
    		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    			if (results.length > 0) {
    				request.session.loggedin = true;
    				request.session.username = username;
            request.session.role = results[0].role;
            if(results[0].role == 0){
              response.redirect('/');
            }else {
              response.redirect('/trangchuadmin');
            }
    			} else {
    				response.send('Incorrect Username and/or Password!');
    			}
    			// response.end();
    		});
    	} else {
    		response.send('Please enter Username and Password!');
    		// response.end();
    	}
});
    //thêm tài khoản...
    app.post('/adduser', function(request, response) {
    	var username = request.body.username;
    	var password = request.body.password;
      var password1 = request.body.password1;
      var mail = request.body.mail;

    	if (username && password && mail) {
        var string = "INSERT INTO `user`(`mail`,`username`,`password`,`role`) VALUES ('"+mail+"','"+username+"','"+password+"',0)";
    		connection.query(string, function(err, results) {
          if (err) {
            console.log(err);
            return request.status(500).send(err);
          }
          response.redirect('/login');
    		});
    	} else {
    		response.send('Please enter Username and Password and Email!');
    		// response.end();
    	}
});
    app.get('/', function(req, res) {
        var mess = [];
        var kt = 0;
        connection.query("SELECT * FROM news", function (err, result, fields) {
            if (err) throw err;
            //console.log(result);
            if(req.session.loggedin){
              kt=1;
              res.render('home', {
                static_path: 'static',
                theme: process.env.THEME || 'flatly',
                flask_debug: process.env.FLASK_DEBUG || 'false',
                mess : result,
                type : type,
                user : req.session.username,
                kt   : kt
            });
          }else {
            res.render('home', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              mess : result,
              type : type,
              kt   : kt
          });
          }
        })
    });

    app.get('/trangchuadmin', function(req, res) {
              res.render('TrangChuAdmin', {
                static_path: 'static',
                theme: process.env.THEME || 'flatly',
                flask_debug: process.env.FLASK_DEBUG || 'false',
            });
    });

    app.get('/login', function(req, res) {
              res.render('login', {
                static_path: 'static',
                theme: process.env.THEME || 'flatly',
                flask_debug: process.env.FLASK_DEBUG || 'false',
            });
    });

    app.get('/danhsachtin', function(req, res) {
        var mess = [];
        connection.query("SELECT * FROM news", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
              res.render('danhsachtin', {
                static_path: 'static',
                theme: process.env.THEME || 'flatly',
                flask_debug: process.env.FLASK_DEBUG || 'false',
                mess : result,
                type : type
            });
        })
    });

    app.get('/admin/khachhang', function(req, res) {
      connection.query("SELECT * FROM user where role=0", function (err, result, fields) {
          if (err) throw err;
            res.render('khachhang', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              mess : result,
          });
      })
    });

    app.get('/themtin', function(req, res) {
      var mess = [];
      connection.query("SELECT * FROM type", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
            res.render('add', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              types : result,
          });
      })
  });

    app.get('/types/:type', function(req, res) {
      var mess = [];
      connection.query("SELECT * FROM DataNews.news where type like (select type.name from DataNews.type where idtype ="+req.params.type+")", function (err, result, fields) {
          if (err) throw err;
            res.render('newstype', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              mess : result,
              type : type
          });
      })
  });

    app.get('/news/:id', function(req, res) {
      var mess = [];
      connection.query("SELECT * FROM news where idnews="+ req.params.id, function (err, result, fields) {
          if (err) throw err;
            res.render('Content', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              mess : result,
              type : type,
              list : list
          });
      })
  });

  app.get('/admin/addnews', function(req, res) {
    var mess = [];
    connection.query("SELECT * FROM type", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
          res.render('addnews', {
            static_path: 'static',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            types : result,
        });
    })
});

  app.post('/news',function(req,res){
    console.log("Hello");

    var title = req.body.title;
    var type = req.body.type;
    var describe = req.body.describe;
    var content = req.body.content;
    var image = req.body.image;
    console.log(type + " " +title+" "+describe+" "+content+" "+image);
    var query = "INSERT INTO `news`(`title`,`describe`,`content`,`type`,`image`) VALUES ('" +
    title + "', '" + describe + "', '" + content + "', '" + type + "', '" + image + "')";
    connection.query(query,(err,result)=>{
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.status(201).end();
    })
  });

    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
