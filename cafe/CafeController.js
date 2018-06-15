var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

 var firebase = require('firebase');
// var storageRef = firebase.storage().ref('images');
var database = firebase.database();

/*
Создает новую акцию(POST)

ПРИНИМАЕТ:
  *Название кафе
  *Адресс
  *Описание
  *URL Картинки

ВОЗВРАЩАЕТ:
  *Ответ успешно ли добавилась информация о акции
*/
router.post('/new', function(req, res) {
    var keyNew = database.ref().push().key;
    var data = {
      name : req.body.name,
      description: req.body.description,
      adress : req.body.adress,
      pictureURL : req.body.pictureURL,
      users : 0
    }
    database.ref('cafe/' + keyNew).set(data,function (err) {
      if (err) return res.status(500).send({add:false})
      res.status(200).send({add:true});
    });
});

//ВОЗВРАЩАЕТ ВСЕ КАФЕ
router.get('/', function (req, res) {
  database.ref('cafe').once('value',function(snapshot , err) {
      if (err)  res.status(500).send({error:err});
      res.status(200).send({data:snapshot.val()});
  });
});

//ВОЗВРАЩАЕТ ОТДЕЛЬНОЕ КАФЕ ПО ID

router.get('/:id', function (req, res) {
  var str = [];
  function getCafe(data, id){
    for(var x in data){
      if(data[x].id && data[x].id.split(",").indexOf(id.toString())!=-1) {
        var name = data[x].name;
        var adress = data[x].adress;
        JSON.stringify(str.push({x ,name , adress }));
      }
    }
    if(str != []) return str;
    return "Not Found";
  }

  var id = req.headers['x-id'];
  database.ref('cafe').on("value", function(snapshot) {
          var us = getCafe(snapshot.val(),id) ;
          if(us == "Not Found") res.status(500).send({err : "Not found"});
          res.status(200).send({data:us});
    });
});

// УДАЛЯЕТ АКЦИЮ ПО ID

router.delete('/:id', function (req, res) {
  firebase.database().ref('cafe/' + req.body.id)
      .remove()
      .then(() => {
        res.status(200).send({deleted:true});
      })
      .catch(
        error => {
            console.log(err)
            res.status(500).send({deleted:false});
        }
      )
});

// ИЗМЕНЯЕТ КАфЕ ПО ID
router.put('/:id', function (req, res) {
  
  firebase.database().ref('stock/' + req.body.id).update({
      header: req.body.header,
      description: req.body.description,
      pictureURL: req.body.pictureURL
    }, function(error) {
      if (error) {
          return res.status(500).send({updated:false});
      } else {
          res.status(200).send({updated:true});
      }
  });
});

module.exports = router;