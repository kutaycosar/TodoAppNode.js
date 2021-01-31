let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')

let app = express()
let db

let port = process.env.PORT
if (port == null || port == ""){
  port = 3000
}

app.use(express.static('public'))

let connectionString = 'mongodb://todoAppUser:0024882aaa@cluster0-shard-00-00.m1hmo.mongodb.net:27017,cluster0-shard-00-01.m1hmo.mongodb.net:27017,cluster0-shard-00-02.m1hmo.mongodb.net:27017/TodoApp?ssl=true&replicaSet=atlas-tj1li7-shard-0&authSource=admin&retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db()
  app.listen(port)
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

function passwordProtected(req, res, next){
  res.set('WWW-Authenticate', 'Basic realm="Simple todo app"')

  console.log(req.headers.authorization)
  if(req.headers.authorization == "Basic a3V0YXk6MDAyNDg4Mg=="){
    next() //paswordProtected calistiktan sonra app.get "/" da next sayesinde function a gec yani devam et
  }else{
    res.status(401).send("Yanlis sifre girdiniz")
  }
  
}

app.get('/', function(req, res) {
  db.collection('items').find().toArray(function(err, items) {
    res.send(`<!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
  <div class="container">
  <h1 class="display-4 text-center py-1">To-Do App!</h1>
  
  <div class="jumbotron p-3 shadow-sm">
  <form id="create-form" action="/create-item" method="POST">
  <div class="d-flex align-items-center">
  <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
  <button class="btn btn-primary">Add New Item</button>
  </div>
  </form>
  </div>
  
  <ul id="item-list" class="list-group pb-5">
    
  </ul>
 
  
  </div>
  
    <script>
    let items = ${JSON.stringify(items)} //itemlari stringe donusturuyor
    </script>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
  </body>
  </html>`)
  })
})

app.use(passwordProtected)

app.post('/create-item', function(req, res) {
  db.collection('items').insertOne({text: req.body.text}, function(err, info) { //req.body.item degil text cunku browser.js icinde text yaptik
    res.json(info.ops[0]) //info.ops [0] 0  insertOne methoduyla olusturdugumuz gorev. yani yazdigim yazi todoya
    
  })
})

app.post('/update-item', function(req, res) {
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, function() {
    res.send("Success")
  })
})

app.post('/delete-item', function(req, res) {
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
    res.send("Success")
  })
})