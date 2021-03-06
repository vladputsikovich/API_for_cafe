var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

 var firebase = require('firebase');
// var storageRef = firebase.storage().ref('images');
// var database = firebase.database();

/*
Создает новую акцию(POST)

ПРИНИМАЕТ:
  *Дату проведения акции
  *Заголовок
  *Описание
  *URL Картинки
  *Кафе которое проводит акцию

ВОЗВРАЩАЕТ:
  *Ответ успешно ли добавилась информация о акции
*/
router.post('/new', function(req, res) {
  
    res.status(200).send(req.body);
    var keyNew = database.ref().push().key;
    var data = {
      date : req.body.date,
      description: req.body.description,
      header : req.body.header,
      pictureURL : req.body.pictureURL,
      cafe : req.body.cafe
    }
    database.ref(req.body.cafe +'/stock/' + keyNew).set(data,function (err) {
      if (err) return res.status(500).send({error : err})
      res.status(200).send({add:true});
    });
});

//ВОЗВРАЩАЕТ ВСЕ АКЦИИ
router.get('/', function (req, res) {
  database.ref('stock').once('value',function(snapshot , err) {
      if (err)  res.status(500).send('Error on the server.');
      res.status(200).send(snapshot.val());
  });
});

//ВОЗВРАЩАЕТ ОТДЕЛЬНУЮ АКЦИЮ

router.get('/:id', function (req, res) {
  var str = [];
  function getPurch(data, id){
    for(var x in data){
      if(data[x].id && data[x].id.split(",").indexOf(id.toString())!=-1) {
        var date = data[x].date;
        var sum = data[x].sum;
        JSON.stringify(str.push({x ,sum , date }));
      }
    }
    if(str != []) return str;
    return "Not Found";
  }

  var id = req.headers['x-id'];
  database.ref('purches').on("value", function(snapshot) {
          var us = getPurch(snapshot.val(),id) ;
          if(us == "Not Found") res.status(500).send({err : "Not found"});
          res.status(200).send(us);
    });
});

// УДАЛЯЕТ АКЦИЮ ПО ID

router.delete('/:id', function (req, res) {
  firebase.database().ref('/stock/' + req.body.id)
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

// ИЗМЕНЯЕТ АКЦИЮ ПО ID
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