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

  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

  function UpdateData(id , sum , cafe){

      function getUser(data, id){
        for(var x in data){
          if(x && x.split(",").indexOf(id.toString())!=-1) {
            return [data[x].count_buy ,data[x].count_visit, data[x].sum, x];
          }
        }
        return "Not Found";
      }
      database.ref('cafe/'+cafe+'/users').once('value',function(snapshot , err) {
        var user = getUser(snapshot.val() , id);
        console.log('user : ' + user);
        if(user == "Not Found") {
          database.ref('cafe/' + cafe + '/users/' + id).set({
            sum:  Number(sum),
            count_buy: Number(req.body.buys),
            count_visit: 1,
            date: new Date().toLocaleString("ru")
          }, function(err) {
            if (err) {
              res.status(500).send({error:err});
            }
          });
        }
        else {
          database.ref('cafe/'+cafe+'/users/' + user[3]).update({
            sum: Number(user[2]) + Number(sum),
            count_buy: Number(user[0]) + Number(req.body.buys),
            count_visit: Number(user[1]) + 1,
            date: new Date().toLocaleString("ru")
          }, function(error) {
            if (error) {
              res.status(500).send('Error on the server.Error: '+error);
            }
          });
        }
        //res.status(200).send({user: snapshot.val()[user[1]]});
        
      });
    }
    var keyNew = database.ref().push().key;
    var data = {
      id: req.body.id,
      date : new Date().toLocaleString("ru"),
      sum : req.body.sum,
      cafe : req.body.token
    }
    console.log(data);
    database.ref('purches/' + keyNew).set(data,function (err) {
        if (err) res.status(500).send({error : err})
        UpdateData(req.body.id , req.body.sum , req.body.token);
        res.status(200).send({add:true});
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