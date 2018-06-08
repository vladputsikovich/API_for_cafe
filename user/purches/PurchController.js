var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var crypto = require('crypto');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var firebase = require('firebase');
var database = firebase.database();

/*
Создает новую покупку(POST)

ПРИНИМАЕТ:
  *Дату покупки
  *Сумму покупки
  *Пользователь(токен/id)

ВОЗВРАЩАЕТ:
  *Ответ успешно ли совершилась оформление покупки
*/
router.post('/new', function(req, res) {

  function UpdateData(id , sum){

      function getUser(data, id){
        for(var x in data){
          if(data[x].id && data[x].id.split(",").indexOf(id.toString())!=-1) {
            return [data[x].count_buy ,data[x].count_visit, data[x].sum, data[x].token];
          }
        }
        return "Not Found";
      }
      database.ref('users').once('value',function(snapshot , err) {
        var user = getUser(snapshot.val() , id);
        //res.status(200).send({user: snapshot.val()[user[1]]});
        database.ref('users/' + user[3]).update({
          sum: Number(user[2]) + Number(sum),
          count_buy: Number(user[0]) + 1,
          count_visit: Number(user[1]) + 1,
          date: new Date().toLocaleString("ru")
        }, function(error) {
          if (error) {
            res.status(500).send('Error on the server.Error: '+error);
          }
        });
      });
    }
    
    var keyNew = database.ref().push().key;
    var data = {
      id: req.body.id,
      date : new Date().toLocaleString("ru"),
      sum : req.body.sum
    }
    console.log(data);
    database.ref('purches/' + keyNew).set(data,function (err, user) {
        if (err) res.status(500).send("Возникли ошибки при оформлении покупки.")
        res.status(200).send("Покупка оформлена");
        UpdateData(req.body.id , req.body.sum);
    });
});



//ВОЗВРАЩАЕТ ВСЕ ПОКУПКИ
router.get('/', function (req, res) {
  database.ref('purches').once('value',function(snapshot , err) {
      if (err)  res.status(500).send('Error on the server.');
      res.status(200).send(snapshot.val());
  });
});

//ВОЗВРАЩАЕТ ПОКУПКИ ОТДЕЛЬНОГО ПОЛЬЗОВАТЕЛЯ ПО Id

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
          res.status(200).send(us);
    });
});

module.exports = router;    