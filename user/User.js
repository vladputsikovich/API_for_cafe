/*var mongoose = require('mongoose');  
var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');*/


/*var firebase = require('firebase');

var database = firebase.database();

function randomInteger(min, max) {
  var rand = min + Math.random() * (max - min)
  rand = Math.round(rand);
  return rand;
}

var ID = randomInteger(100,5000);


var writeUserData = function(userId, name, email, password) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    password : password
  });
}

module.exports.writeUserData = writeUserData;*/