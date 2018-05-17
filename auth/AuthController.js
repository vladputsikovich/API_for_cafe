var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var firebase = require('firebase');
var database = firebase.database();
var ref = database.ref('users');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


var User = require('../user/User');

router.post('/register', function(req, res) {

  console.log(req.body.name);
  var key = ref.push().key;
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  var data = {
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  }

ref.push(data,function (err, user) {
    
    if (err) return res.status(500).send("There was a problem registering the user.")

    // create a token
    var token = jwt.sign({ id: key}, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  });

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

  router.get('/me', function(req, res) {
    
    var token = req.headers['x-access-token'];

    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      res.status(200).send(decoded);
      console.log(decoded['id']);
      /*
      User.findById(decoded.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        
        res.status(200).send(user);
      });
      */
      var userId = decoded['id'];
      var newref = ref.child("-LCiiPlb3W5pkGSFMo3f").child('name');
      newref.on("value", function(snapshot) {
        var us = snapshot.val();
        console.log("name: " + us);
      });
    });
  });

  router.post('/login', function(req, res) {

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
  
  });

  router.get('/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });

  module.exports = router;