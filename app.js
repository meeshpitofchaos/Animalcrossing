const dotenv = require('dotenv').config()
const express = require('express')
const MongoClient = require('mongodb').MongoClient

// setup debug.log
const fs = require('fs')
const util = require('util')
let logFile = fs.createWriteStream( './debug.log' )
console.log = (message) => {
  message = util.format(message) + '\n'
  logFile.write(message)   
}

const app	= express();  			// activate an express app
app.use( express.json() ); 		// enable parsing of JSON data in our app

app.use('/AnimalCrossingVillage', express.static('public'))

// Listen for HTTP GET requests.
app.get('/AnimalCrossingVillage/AnimalCrossing/', (req, res) => {

    // log information about the request
    console.log('AnimalCrossing requested'
        + ' on ' + new Date()
        + ' by ' + req.headers['x-forwarded-for']
        + ' with ' + req.headers['user-agent']
        + ' at ' + req.headers['referer']
      )
  
  const client = new MongoClient(
        process.env.DB, {
          useUnifiedTopology: true,
          useNewUrlParser: true
        }
    );

  client.connect(err => {
    if (err) { console.log(err); }
    let query = {height:{$gt:10}}
    let projection = {'name':1,'species':1,'catch-phrase':1, 'image_uri':1,'_id':0,'personality':1, 'saying':1}
    // search mongo collection for all dragons
    client.db("AnimalCrossing").collection("AnimalCrossingVillagers")
      .find( query )
      .project( projection )
      .toArray( (err, item) => {
        if (err) { res.send({ 'error': 'An error has occured' }); }
        else { res.send( item );	}		// send the result back.
      });
  });
});

  app.listen(0, () => {
   console.log("We are live." );
 });