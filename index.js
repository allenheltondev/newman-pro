/**
 * @module newman-pro
 */

/**
 * Runs the newman cli using the Postman Pro API to pull down the latest version of a collection or environment
 */

/*jshint esversion: 6 */
let settings = require('./src/settingsHandler');
let postman = require('./src/postmanHandler');
let optionDefinitions = require('./src/optionDefinitions');
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions.definitions);
const readline = require('readline-sync');

// Function variables
let apiKey;
let collectionName;
let environmentName;

function newmanpro(key, collection, environment){
  apiKey = key;
  collectionName= collection;
  environmentName = environment;
  
  runNewman(options);
}

function newmanpro() {
  'use strict';

  apiKey = options["api-key"];
  collectionName = options["collection-name"];
  environmentName = options["environment-name"];
  
  if (isHelp(options))
    return;
  
  if (isApiKeyOperation(options))
    return;

  if (isWalkthroughMode(options))
    return;

  runNewman(options);
}

function runNewman(options) {
  validateParameters(options);

  if (collectionName) {
    let colRes = postman.getCollectionUid(apiKey, collectionName);
    colRes.then(colUid => {
      if (!colUid) {
        console.log(`Could not find collection with the name '${collectionName}'`);
        process.exit(1);
      }
      executeOperation(options, colUid);
    })
      .catch(err => console.log("Unable to acquire Collection Uid." + err));
  }
  else {
    executeOperation(options, options["collection-uid"]);
  }
}

function executeOperation(options, collectionUid) {
  if (environmentName) {
    let envRes = postman.getEnvironmentUid(apiKey, environmentName);
    envRes.then(envUid => {
      if (!envUid) {
        console.log(`Could not find environment with the name '${environmentName}'`);
        process.exit(1);
      }
      postman.runNewman(apiKey, collectionUid, envUid, options.bail, options.reporter);
    })
      .catch(err => console.log("Unable to acquire Environment Uid."));
  }
  else {
    postman.runNewman(apiKey, collectionUid, options["environment-uid"], options.bail, options.reporter);
  }
}

function isApiKeyOperation(options) {
  if (options["set-api-key"]) {
    settings.setApiKey(options["set-api-key"]);
    console.log('Api key has been saved.');
    return true;
  }

  if (options["clear-api-key"]) {
    settings.clearApiKey();
    console.log('Api key has been cleared.');
    return true;
  }

  if (options["show-api-key"]) {
    let key = settings.showApiKey();
    console.log(key);
    return true;
  }

  return false;
}

function validateParameters(options) {
  // Validate an api key has been specified
  configureApiKey();

  // Validate a collection uid or name has been specified
  if (!collectionName && !options["collection-uid"]) {
    console.log("A collection name or uid is required.");
    process.exit(1);
  }
}

function isWalkthroughMode(options) {
  if (!options["list-collections"])
    return false;

  configureApiKey();
  let response = postman.listCollections(apiKey);
  response.then(collections => {
    let collectionNames = [];
    for (i = 0; i < collections.length; i++) {
      collectionNames.push(collections[i].name);
    }
    let index = readline.keyInSelect(collectionNames, 'Which collection would you like to run?');
    if (index == -1) process.exit();

    let chooseEnv = readline.keyInYNStrict("Run in specific environment?");
    if (chooseEnv) {
      let res = postman.listEnvironments(apiKey);
      res.then(environments => {
        let envNames = [];
        for (j = 0; j < environments.length; j++) {
          envNames.push(environments[j].name);
        }
        let envIndex = readline.keyInSelect(envNames, 'Which environment would you like to use?');
        if (envIndex > -1)
          options["environment-uid"] = environments[envIndex].uid;
        
        executeOperation(options, collections[index].uid)
      })
        .catch(err => console.log("Unable to load environments."));     
    }
    else {
      executeOperation(options, collections[index].uid);
    }
  })
    .catch(err => console.log("Unable to load collections. Make sure Api key is valid."));
  
  return true;
}

function configureApiKey() {
  if (!apiKey) {
    let savedApiKey = settings.getApiKey();
    if (!savedApiKey) {
      console.log("You must pass in a valid api key.");
      process.exit(1);
    }
    else {
      apiKey = savedApiKey;
    }
  }
}

function isHelp(options) {
  if (!options.help)
    return false;
  
  let helpText = optionDefinitions.showHelp();
  console.log(helpText);
  return true;
}

module.exports = newmanpro;