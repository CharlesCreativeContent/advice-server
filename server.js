const PORT = process.env.PORT || 3000;
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var https = require('https');
var db, collection;

const url = "mongodb+srv://shawn:shawnpassword@cluster0.ml67f.mongodb.net/demo?retryWrites=true&w=majority";
const dbName = "demo";

app.listen(3000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.get('/advice', (req, res) => {

  https.get(`https://api.adviceslip.com/advice`, (resp) => {
    let data = '';
    resp.on('data', (obj) => {
      data += obj;
    });
    resp.on('end', () => {
          res.render('advice.ejs', JSON.parse(data))
    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
})
