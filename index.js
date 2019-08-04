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

function newmanpro() {

  'use strict';
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

  if (options["collection-name"]) {
    let colRes = postman.getCollectionUid(options["api-key"], options["collection-name"]);
    colRes.then(colUid => {
      if (!colUid) {
        console.log(`Could not find collection with the name '${options["collection-name"]}'`);
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
  if (options["environment-name"]) {
    let envRes = postman.getEnvironmentUid(options["api-key"], options["environment-name"]);
    envRes.then(envUid => {
      if (!envUid) {
        console.log(`Could not find environment with the name '${options["environment-name"]}'`);
        process.exit(1);
      }
      postman.runNewman(options["api-key"], collectionUid, envUid, options.bail, options.reporter);
    })
      .catch(err => console.log("Unable to acquire Environment Uid."));
  }
  else {
    postman.runNewman(options["api-key"], collectionUid, options["environment-uid"], options.bail, options.reporter);
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
  configureApiKey(options);

  // Validate a collection uid or name has been specified
  if (!options["collection-name"] && !options["collection-uid"]) {
    console.log("A collection name or uid is required.");
    process.exit(1);
  }
}

function isWalkthroughMode(options) {
  if (!options["list-collections"])
    return false;

  configureApiKey(options);
  let response = postman.listCollections(options["api-key"]);
  response.then(collections => {
    let collectionNames = [];
    for (i = 0; i < collections.length; i++) {
      collectionNames.push(collections[i].name);
    }
    let index = readline.keyInSelect(collectionNames, 'Which collection would you like to run?');
    if (index == -1) process.exit();

    let chooseEnv = readline.keyInYNStrict("Run in specific environment?");
    if (chooseEnv) {
      let res = postman.listEnvironments(options["api-key"]);
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

function configureApiKey(options) {
  if (!options["api-key"]) {
    let apiKey = settings.getApiKey();
    if (!apiKey) {
      console.log("You must pass in a valid api key.");
      process.exit(1);
    }
    else {
      options["api-key"] = apiKey;
    }
  }
}

function isHelp(options) {
  if (!options.help)
    return false;
  
  optionDefinitions.showHelp();
  return true;
}

module.exports = newmanpro;