/*jshint esversion: 6 */
let axios = require('axios');
let fs = require('fs');
let newman = require('newman');

const optionDefinitions = [
  { name: 'api-key', alias: 'a', type: String },
  { name: 'collection-uid', alias: 'c', type: String },
  { name: 'environment-uid', alias: 'e', type: String }
];
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);

'use strict';

//console.log('api-key: ' + options["api-key"]);
console.log(JSON.stringify(options));


axios.get('https://api.getpostman.com/collections/' + options["collection-uid"], { headers: { 'X-Api-Key': options['api-key'] } })
  .then(response => {
    fs.writeFile("collection.json", JSON.stringify(response.data), (err) => {
      if (err) console.log(err);
    });
    console.log("collection gathered");
  })
  .catch(error => {
    console.log("Could not load the collection with the given id. Check the uid or your api key");
  });



if (options["environment-uid"]) {
  axios.get('https://api.getpostman.com/environments/' + options["environment-uid"], { headers: { 'X-Api-Key': options['api-key'] } })
    .then(response => {
      fs.writeFile("environment.json", JSON.stringify(response.data), (err) => {
        if (err) console.log("test" + err);
      });
    })
    .catch(error => {
      console.log(error);
    });
}

   let params = {
     collection: './collection.json',
     reporters: 'cli'
   };
  
   if(options["environment-uid"]) params.environment = './environment.json';

   newman.run(params, function(err){
     if(err) throw err;
     console.log('collection run complete');
   });

