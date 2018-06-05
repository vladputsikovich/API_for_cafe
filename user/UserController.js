var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var firebase = require('firebase');
var database = firebase.database();

var User = require('./User').default;

// CREATES A NEW USER
/*router.post('/', function (req, res) {
    User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});*/

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    function getUsers(data){
        var str = "";
        for(var x in data){
             str += ["Login - "+data[x].name , " ID - "+x , " Email - "+data[x].email]+"\n";
        }
        if(str == "")   return "Not Found";
        return data;
      }

    database.ref('users').once('value',function(snapshot , err) {
        if (err) return res.status(500).send('Error on the server.');
        res.status(200).send(getUsers(snapshot.val()));
    });
    /*User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });*/
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    var id = req.headers['x-id'];
    database.ref('users').child(id).child('name').on("value", function(snapshot) {
            var us = snapshot.val().name;
            console.log("USER " + us);
      });

    /*User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });*/
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    firebase.database().ref('/users/' + req.body.id)
        .remove()
        .then(() => {
          res.status(200).send("User was deleted.");
        })
        .catch(
          error => {
              console.log(err)
              res.status(500).send("There was a problem deleting the user.");
          }
        )
    /*User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });*/
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    
    firebase.database().ref('users/' + req.body.id).update({
        name: req.body.name,
        email: req.body.email,
        access: req.body.access
      }, function(error) {
        if (error) {
            return res.status(500).send("There was a problem updating the user.");
        } else {
            res.status(200).send("User: "+ req.body.name +" was updated.");
        }
      });
    
    
    /*User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });*/
});


module.exports = router;