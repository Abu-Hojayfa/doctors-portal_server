const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
require('dotenv').config();

const host = process.env.DB_HOST;
const pass = process.env.DB_PASS;
const db = process.env.DB_DATABASE;
const collection1 = process.env.DB_COLLECTION1;
const collection2 = process.env.DB_COLLECTION2;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${host}:${pass}@cluster0.pec8g.mongodb.net/${db}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const doctorSchedule = client.db(`${db}`).collection(`${collection1}`);
  const bookPatient = client.db(`${db}`).collection(`${collection2}`);

  app.get('/appointment-schedule', (req, res)=>{
    doctorSchedule.find({})
    .toArray((err, data) => {res.send(data);});
  });

  app.post('/bookticket', (req, res)=>{
    const data = req.body;
    bookPatient.insertOne(data)
    .then(data => res.send(data));
  }); 
  
  app.post('/appointmentbydate', (req, res)=>{
    const date = req.body;
    bookPatient.find({time: date.date})
    .toArray((err, data)=>{
      res.send(data);
    });
  });

});

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});