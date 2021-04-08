const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());
console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9grss.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("connection err", err)
  const productCollection = client.db("misti-village").collection("products");
  const ordersCollection = client.db("misti-village").collection("orders"); 

  





  app.get('/products', (req, res) => {
    productCollection.find()
      .toArray((err, items) => {
        res.send(items)
        
      })
  })

  app.get('/manageProducts', (req, res) => {
    productCollection.find()
      .toArray((err, items) => {
        res.send(items)
        
      })
  })

  

  app.delete('/deleteProduct/:id',(req, res) =>{
    
    const id = objectId(req.params.id);
    console.log(id)
    productCollection.findOneAndDelete({_id:id})
    .then(result => {
      res.send(!!result.deletedCount >0)
      
    })
  })

  app.post('/addProducts', (req, res) => {
    const newProduct = req.body;
    console.log('adding new product: ', newProduct)
    productCollection.insertOne(newProduct)
      .then(result => {
        
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/placeOrder', (req, res) =>{
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result => {
      res.send(result.insertedCount > 0);
    })
    console.log(newOrder);
  })

  app.get('/order',(req,res) => {
    ordersCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  //client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})