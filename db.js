/*var mongoose = require('mongoose');
mongoose.connect('mongodb://yourMongoDBURIGoesHere');*/

var firebase = require('firebase');

var config = {
    apiKey: "AIzaSyA6Psp4HWyDzGS3qRFyxNKKcPZk1NjuPdk",
    authDomain: "for-cafe.firebaseapp.com",
    databaseURL: "https://for-cafe.firebaseio.com",
    projectId: "for-cafe",
    storageBucket: "for-cafe.appspot.com",
    messagingSenderId: "665450191555"
  };

  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();