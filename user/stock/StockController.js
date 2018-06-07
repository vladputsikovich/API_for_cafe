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

ВОЗВРАЩАЕТ:
  *Ответ успешно ли добавилась информация о акции
*/
router.post('/new', function(req, res) {
  
    res.status(200).send(req.body);
    var keyNew = database.ref().push().key;
    var data = {
      header : req.body.header,
      description: req.body.description,
      date : new Date().toLocaleString("ru"),
      pictureURL : req.body.pictureURL
    }
    database.ref('stock/' + keyNew).set(data,function (err) {
      var metadata = {
        contentType: 'image/png',
      };
      if (err) return res.status(500).send("Возникли ошибки при добавлении акции")
      res.status(200).send("Успешно добалена");
    });
});



module.exports = router;