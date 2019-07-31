/*jshint esversion: 6 */
let postman = require('./src/postmanHandler');
let optionDefinitions = require('./src/optionDefinitions');
let settings = require('./src/settingsHandler');
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);

'use strict';

handleApiSetting(options);
validateParameters(options);


if (options["collection-name"]) {
  let colRes = postman.getCollectionUid(options["api-key"], options["collection-name"]);
  colRes.then(colUid => {
    executeOperation(options, colUid);
  })
    .catch(err => console.log("Unable to acquire Collection Uid."));
}
else {
  executeOperation(options, options["collection-uid"]);
}

function executeOperation(options, collectionUid) {
  if (options["environment-name"]) {
    let envRes = postman.getEnvironmentUid(options["api-key"], options["environment-name"]);
    envRes.then(envUid => {
      postman.runNewman(options["api-key"], collectionUid, envUid, options.bail, options.reporter);
    })
      .catch(err => console.log("Unable to acquire Environment Uid."));
  }
  else {
    postman.runNewman(options["api-key"], collectionUid, options["environment-uid"], options.bail, options.reporter);
  }
}

function handleApiSetting(options){
  if (options["set-api-key"]) {
    settings.setApiKey(options["set-api-key"]);
    console.log('Api key has been saved.');
    process.exit();
  }
  
  if(options["clear-api-key"]){
    settings.clearApiKey();
    console.log('Api key has been cleared.');
    process.exit();
  }  
}

function validateParameters(options){
  // Validate an api key has been specied
  if (!options["api-key"]) {
    let apiKey = settings.getApiKey();
    if (!apiKey) {
      console.log("You must pass in a valid api key.");
      process.exit();
    }
    else {
      options["api-key"] = apiKey;
    }  
  }

  // Validate a collection uid or name has been specified
  if (!options["collection-name"] && !options["collection-uid"]) {
    console.log("A collection name or uid is required.");
    process.exit();
  }
}
