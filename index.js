/*jshint esversion: 6 */
let newman = require('newman');
let postman = require('./postmanHandler');
let optionDefinitions = require('./optionDefinitions');
const commandLineArgs = require('command-line-args');
const options = commandLineArgs(optionDefinitions);

'use strict';


let response = postman.getLiveVersion(options["api-key"], options["collection-uid"], options["environment-uid"]);
response.then(() => {
  let params = postman.buildNewmanParams(options["environment-uid"]);

  newman.run(params, function(err){
    if(err) throw err;
    console.log('collection run complete');
  });
});