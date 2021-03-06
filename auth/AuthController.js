var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var firebase = require('firebase');
var database = firebase.database();
var crypto = require('crypto');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());



/*
Создает нового пользователя(POST)

ПРИНИМАЕТ:
  *ФИО пользователя
  *Email пользователя
  *Пароль пользователя -

ВОЗВРАЩАЕТ:
  *токен на 24 часа
  *статус что пользователь успешно авторизован
*/
router.post('/register', function(req, res) {

  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

 function getUser(data, email){
  for(var x in data){
    if(data[x].email && data[x].email.split(",").indexOf(email.toString())!=-1) {
      return  true;
    }
  }
  return false;
}
database.ref(req.body.cafe +'/'+ 'users').once('value',function(snapshot , err) {
  var checkEmail = getUser(snapshot.val() , req.body.email);
  if(checkEmail) 
  {
    res.status(500).send({checkEmail:false});//изменить
  }
  else
  {
    var keyNew = database.ref().push().key;
    var _id = crypto.randomBytes(10).toString('hex');
    //var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var data = {
      name : req.body.name,
      email : req.body.email,
      password : req.body.password,
      access: req.body.access,
      phone: req.body.phone,
      token: keyNew,
      id: _id,
      //count_visit: 0,
      //count_buy : 0,
      //date : 0,
      //sum : 0,
      cafes: 0,
      banned: false
    }
    console.log(keyNew);
    database.ref('users/' + keyNew).set(data,function (err, user) {
        if (err)  res.status(500).send("There was a problem registering the user.")
        res.status(200).send({ auth: true, token: keyNew });
      });
  }
})


  /*
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    
    User.writeUserData({
      userID:req.body.id,
      name : req.body.name,
      email : req.body.email,
      password : req.body.password
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.")
  
      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
  
      res.status(200).send({ auth: true, token: token });
    }); */


  });
/*
Возвращает данные о пользователе(GET)

ПРИНИМАЕТ:
  *Токен

ВОЗВРАЩАЕТ:
  *Данные о пользователе
*/
  router.get('/me', function(req, res) {

    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    console.log(token);
    database.ref('users').child(token).on("value", function(snapshot) {
            var us = snapshot.val();
            console.log("USER " + us);
            res.status(200).send({ auth: true , user: us});
      });
    /*
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      res.status(200).send(decoded);

      console.log(decoded['id']);

      var userId = decoded['id'];
      var newref = database.ref('users').child(userId).child('name');
      newref.on("value", function(snapshot) {
        var us = snapshot.val();
        console.log("name: " + us);
      });
    });*/
  });

/*
Производит авторизацию существующего пользователя(POST)

ПРИНИМАЕТ:
  *Email пользователя
   Проверяет есть ли данный пользователь в базе
   Если есть дополнительно принимает пароль, 
   сверяет его с паролем пользователя в базе 

ВОЗВРАЩАЕТ:
  *токен на 24 часа
  *статус что пользователь успешно авторизован
*/

  router.post('/login', function(req, res) {

    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');

  
   function getUser(data, email){
      for(var x in data){
        if(data[x].email && data[x].email.split(",").indexOf(email.toString())!=-1) {
          return [data[x].name , x , data[x].password , data[x].access];
        }
      }
      return "Not Found";
    }
    
    database.ref('users').once('value',function(snapshot , err) {
      var email = req.body.email.replace(' ','');
      var user = getUser(snapshot.val() , email);
      console.log(user);
      if (err) return res.status(500).send('Error on the server.');
      if (user === "Not Found") return res.status(404).send('No user found.');
      //var passwordIsValid = bcrypt.compareSync(req.body.password, user[2]);   //исправить    
      var passwordIsValid = false; 
      if(req.body.password == user[2]) passwordIsValid = true
      console.log(passwordIsValid);
      
      if (!passwordIsValid) return res.status(401).send({ auth: false });

      res.status(200).send({ auth: true , user: user[1] , access: user[3]});
    }/*,
    function(err){
      console.log("конитель");
      if (err) return res.status(500).send('Error on the server.');
      if ("Not Found") return res.status(404).send('No user found.');

      var passwordIsValid = bcrypt.compareSync(req.body.password, user[2]);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
  
      var token = jwt.sign({ id: getID()}, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
    }*/
  );

    /*database.ref('users').on("value" , function(snapshot){
      var user = getID(snapshot.val() , req.body.email)
      console.log(getID(snapshot.val() , req.body.email));
    }/*,
    function(err){
      console.log("конитель");
      if (err) return res.status(500).send('Error on the server.');
      if ("Not Found") return res.status(404).send('No user found.');

      var passwordIsValid = bcrypt.compareSync(req.body.password, user[2]);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
  
      var token = jwt.sign({ id: getID()}, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
    }
  )*/
/*
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
  
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
  
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
  
      res.status(200).send({ auth: true, token: token });
    });
  */
  });
/*
  Делает пользователя не авторизованным
 */
  router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });

  module.exports = router;