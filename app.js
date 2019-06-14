
    var AWS = require('aws-sdk');
    var express = require('express');
    var path = require('path');
    var bodyParser = require('body-parser');
    var session = require('express-session');
    var mysql = require('mysql');
    var regex = require('./regex');
    AWS.config.region = process.env.REGION


// var connection = mysql.createConnection({
//   host     : 'den1.mysql2.gear.host',
//   user     : 'datanews',
//   password : 'Lx4kd!?6ZYa6',
//   port     : 3306,
//   database : 'DataNews'
// });

var connection = mysql.createConnection({
  host     : 'den1.mysql2.gear.host',
  user     : 'datanews',
  password : 'Lx4kd!?6ZYa6',
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

var listComment = [];
connection.query("SELECT * FROM comment",function(err,result,fields){
  if(err) throw err;
  listComment=result;
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
      if(!username.match(regex.username)){
        return response.send("Bạn đã nhập sai định dạng username");
      }
      if(!password.match(regex.patternPassword)){
        return response.send("Bạn đã nhập sai định dạng mật khẩu");
      }
    	if (username && password) {
    		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
    			if (results.length > 0) {
    				request.session.loggedin = true;
            request.session.username = username;
            request.session.iduser = results[0].iduser;
            request.session.role = results[0].role;
            request.session.infor = results;
            //console.log(request.session.infor[0].mail);
            
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
  // đăng xuất
    app.get('/exit',function(req,res){
        req.session.loggedin = false;
        res.redirect('/');
    });
    //thêm tài khoản...
    app.post('/adduser', function(request, response) {
    	var username = request.body.username;
    	var password = request.body.password;
      var password1 = request.body.password1;
      var mail = request.body.mail;

      if(!username.match(regex.username)){
        return response.send("Bạn đã nhập sai định dạng username");
      }
      if(!password.match(regex.patternPassword)){
        return response.send("Bạn đã nhập sai định dạng mật khẩu");
      }
      if(!mail.match(regex.patternEmail)){
        return response.send("Bạn đã nhập sai định dạng email");
      }
    	if (username && password && mail) {
        var string = "INSERT INTO `user`(`mail`,`username`,`password`,`role`) VALUES (?,?,?,0)";
    		connection.query(string,[mail,username,password], function(err, results) {
          if (err) {
            console.log(err);
            return response.status(500).send(err);
          }
          response.redirect('/login');
    		});
    	} else {
    		response.send('Please enter Username and Password and Email!');
    		// response.end();
    	}
});
// trang chủ........
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
// loại tin 
    app.get('/types/:type', function(req, res) {
      var kt =0 ;
      connection.query("SELECT * FROM DataNews.news where type like (select type.name from DataNews.type where idtype =?)",req.params.type, function (err, result, fields) {
          if (err) throw err;
          if(req.session.loggedin){
            kt=1;
            res.render('newstype', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              mess : result,
              type : type,
              user : req.session.username,
              kt   : kt
          });
        }else {
            res.render('newstype', {
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

// nội dung bài viết
  app.get('/news/:id', function(req, res) {
    //load comment
    var listComment = [];
    connection.query("SELECT * FROM datanews.comment INNER JOIN datanews.user on comment.iduser = user.iduser where idnews = ?",req.params.id,function(err,result,fields){
    if(err) throw err;
    listComment=result;
    })
    
    var kt = 0;
    var Save = "false";
    connection.query("SELECT * FROM news where idnews=?", req.params.id, function (err, result, fields) {
        if (err) throw err;
        
        if(req.session.loggedin){
          kt=1;
          
          connection.query("SELECT * FROM datanews.user_save_news where idnews = "+req.params.id+" and iduser ="+req.session.iduser, function (err, result1, fields) {
            if (err) throw err;
            console.log("news/:id - Save 1 : "+Save);
            
            if(result1.length >0){
              Save = "true";      
              console.log("news/:id - Save 2 : "+Save);        
            }
            console.log("news/:id - Save 3 : "+Save);
            res.render('Content', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              mess : result,
              type : type,
              list : list,
              listComment : listComment,
              user : req.session.username,
              iduser : req.session.iduser,
              kt   : kt,
              ktSave : Save
          });
          })  
                  
          
      }else {
          res.render('Content', {
            static_path: 'static',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            mess : result,
            type : type,
            listComment : listComment,
            list : list,
            kt   : kt
        });
      }
    })
});
// addComment
    app.post('/news/addComment',function(req,res){
        var name = req.body.name;
        var comment = req.body.comment;
        var dateCurent = new Date();
        var dateTime = ""+dateCurent.getDate() +"/"+ (dateCurent.getMonth()+1)+"/"+dateCurent.getFullYear()+ " " +dateCurent.getHours() +":"+ dateCurent.getMinutes(); 
        var idnews = req.body.idnews; 
      
        if (req.session.loggedin && comment) {
          var string = "INSERT INTO `datanews`.`comment` (`iduser`, `idnews`, `date`, `content`) VALUES ('"+ name +"', '"+ idnews+"', '"+ dateTime +"', '"+comment+"')";         
          connection.query(string, function(err, results) {
            if (err) {
              console.log(err);
              return req.status(500).send(err);
            }
            res.redirect('/news/'+idnews);
          });
        } else {
          res.send('phải đăng nhập hoặc không được bỏ trống commnet!!!');
          // response.end();
        }
        
        
    });
// Lưu bài viết
app.post('/news/addSave',function(req,res){
  var name = req.body.name;
  var dateCurent = new Date();
  var dateTime = ""+dateCurent.getDate() +"/"+ (dateCurent.getMonth()+1)+"/"+dateCurent.getFullYear()+ " " +dateCurent.getHours() +":"+ dateCurent.getMinutes(); 
  var idnews = req.body.idnews; 
  var ktSave = req.body.ktSave;
  console.log("/news/addSave : ktSave : "+ktSave);
  
  if (req.session.loggedin) {
    if(ktSave == "false"){
      console.log("vô ");
      
    var string = "INSERT INTO `datanews`.`user_save_news` (`idnews`, `iduser`, `date`) VALUES ('"+idnews+"', '"+name+"', '"+dateTime+"')";         
    connection.query(string, function(err, results) {
      if (err) {
        console.log(err);
        return req.status(500).send(err);
      }

      res.redirect('/news/'+idnews);
    })
  }else{
    console.log("vô sai");
    
    connection.query("SELECT * FROM datanews.user_save_news where idnews = "+idnews+" and iduser = "+name, function (err, result, fields) {
      if (err) {
        console.log(err);
        res.send('Email hoặc username không đúng!');
      }
      var id = result[0].iduser_save_news;
      connection.query("DELETE FROM `datanews`.`user_save_news` WHERE (`iduser_save_news` = '"+id+"')", function (err, result, fields) {
        if (err) {
          console.log(err);
          return req.status(500).send(err);
        }
        res.redirect('/news/'+idnews);
      });
      
    })
  }
  } else {
    res.send('phải đăng nhập hoặc không được bỏ trống commnet!!!');
    // response.end();
  }
  
  
});
// trang chủ admin.........
    app.get('/trangchuadmin', function(req, res) {
        if(req.session.role == 1){
              req.session.access = true; // đây là biến kiểm tra bạn đã đăng nhập vào admin chưa..........
              res.render('TrangChuAdmin', {
                static_path: 'static',
                theme: process.env.THEME || 'flatly',
                flask_debug: process.env.FLASK_DEBUG || 'false',
            });
          }else {
            res.redirect("/");
          }
    });
    // phần đăng nhập
    app.get('/login', function(req, res) {
              req.session.destroy();
              res.render('login', {
                static_path: 'static',
                theme: process.env.THEME || 'flatly',
                flask_debug: process.env.FLASK_DEBUG || 'false',
            });
    });
    // thông tin cá nhân khách hàng
    app.get('/infor', function(req, res) {
      var checkInfo = true;
      res.render('inforGuest', {
        static_path: 'static',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        mess : req.session.infor,
        checkInfo : checkInfo
    });
});
// quên mật khẩu
    app.get('/forgot', function(req, res) {
      var checkInfo = false;
      res.render('inforGuest', {
        static_path: 'static',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        checkInfo : checkInfo
    });
});
// đổi mật khẩu và quên mật khẩu
    app.post('/chancepass', function(req, res) {
      var pass =  req.body.password1;
      connection.query("SELECT user.iduser FROM datanews.user where user.mail = ? and user.username = ?",[req.body.mail,req.body.username], function (err, result, fields) {
        if (err) {
          console.log(err);
          return res.send('Email hoặc username không đúng!');
        }
        if(result == null || result[0] == undefined){
          return res.send('Không tìm thấy User!');
        }
        connection.query("UPDATE `datanews`.`user` SET `password` = ? WHERE (`iduser` = ?);",[pass,result[0].iduser], function (err, result1, fields) {
          if (err) {
            console.log(err);
            return req.status(500).send(err);
          }
          res.redirect('/login');
        });
        
      })

});   
      
  

    app.get('/admin/danhsachtin', function(req, res) {
      if(req.session.access == true){
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
      }else {
        res.redirect("/");
      }
    });

    app.get('/admin/khachhang', function(req, res) {
      if(req.session.access == true){
      connection.query("SELECT * FROM user where role=0", function (err, result, fields) {
          if (err) throw err;
            res.render('khachhang', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              mess : result,
          });
      })
    }else {
      res.redirect("/");
    }
    });

    app.get('/admin/themtin', function(req, res) {
      if(req.session.access == true){
        if(req.session.sua == true){

        }else {
          connection.query("SELECT * FROM type", function (err, result, fields) {
              if (err) throw err;
                res.render('add', {
                  static_path: 'static',
                  theme: process.env.THEME || 'flatly',
                  flask_debug: process.env.FLASK_DEBUG || 'false',
                  types : result,
              });
          })
        }
    }else {
      res.redirect("/");
    }
  });

// admin/comment
app.get('/admin/comment', function(req, res) {
  if(req.session.access == true){
      connection.query("SELECT * FROM comment", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
            res.render('comment', {
              static_path: 'static',
              theme: process.env.THEME || 'flatly',
              flask_debug: process.env.FLASK_DEBUG || 'false',
              mess : result,
              type : type
          });
      })
  }else {
    res.redirect("/");
  }
});
// comment theo bài.
    app.get('/admin/comment/:id', function(req, res) {
      if(req.session.access == true){
          connection.query("SELECT * FROM comment where idnews=?",req.params.id, function (err, result, fields) {
              if (err) throw err;
              console.log(result);
                res.render('comment', {
                  static_path: 'static',
                  theme: process.env.THEME || 'flatly',
                  flask_debug: process.env.FLASK_DEBUG || 'false',
                  mess : result,
                  type : type
              });
          })
      }else {
        res.redirect("/");
      }
    });

    // tìm kiem
    app.post('/find', function(req, res) {
      var kt =0;
      connection.query("SELECT * FROM datanews.news where datanews.news.title like '%"+req.body.txtfind+"%'", function (err, result, fields) {
        if (err) {
          console.log(err);
          res.send('Không có từ khóa này');
        }
        if(req.session.loggedin){
          kt=1;
          res.render('search', {
            static_path: 'static',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            mess : result,
            type : type,
            user : req.session.username,
            kt   : kt
        });
      }else {
          res.render('search', {
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

  app.get('/admin/addnews', function(req, res) {
    var mess = [];
    connection.query("SELECT * FROM type", function (err, result, fields) {
        if (err) throw err;
          res.render('addnews', {
            static_path: 'static',
            theme: process.env.THEME || 'flatly',
            flask_debug: process.env.FLASK_DEBUG || 'false',
            types : result,
        });
    })
});
  // xóa tin trong admin...
  app.get('/admin/delete/:id', function(req, res) {
    if(req.session.access == true){
    connection.query("DELETE FROM news WHERE idnews=?",req.params.id, function (err, result, fields) {
        if (err) throw err;
          res.redirect("/admin/danhsachtin");
    })
  }else {
    res.redirect("/");
  }
});
// Sửa tin trong admin........
app.get('/admin/danhsachtin/suatin/:id', function(req, res) {
  if(req.session.access == true){
  connection.query("SELECT * FROM news where idnews="+ req.params.id, function (err, result, fields) {
      if (err) throw err;
      res.render('update', {
        static_path: 'static',
        theme: process.env.THEME || 'flatly',
        flask_debug: process.env.FLASK_DEBUG || 'false',
        mess : result,
        type : type,
    });
  })
}else {
  res.redirect("/");
}
});

  app.post('/news',function(req,res){
    var title = req.body.title;
    var type = req.body.type;
    var describe = req.body.describe;
    var content = req.body.content;
    var image = req.body.image;
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

  app.post('/news/update/:id',function(req,res){
    var title = req.body.title;
    var type = req.body.type;
    var describe = req.body.describe;
    var content = req.body.content;
    var image = req.body.image;
    var query = "UPDATE `datanews`.`news` SET `title` = ' "+title+"', `describe` = '"+describe+"', `content` = '"+content+"', `type` = '"+type+"', `image` = '"+image+"' WHERE (`idnews` = ?);"

    connection.query(query,req.params.id,(err,result)=>{
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      res.status(201).end();
    })
  });
  // cách chống những url sai
  app.use((req, res, next) => {
    //res.redirect('/');
    res.send("Chúng tôi hiểu bạn đang có ý định làm gì!! Hãy sử dụng trang web một cách văn minh nhé ^^!");
  });
    var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
