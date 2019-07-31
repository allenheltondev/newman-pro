/*jshint esversion: 8 */
let fs = require('fs');
let axios = require('axios');
let newman = require('newman');
const collectionFile = 'collection.json';
const environmentFile = 'environment.json';

module.exports = {
  getCollectionUid: function (apiKey, collectionName) {
    return axios.get('https://api.getpostman.com/collections', { headers: { 'X-Api-Key': apiKey } })
      .then(res => {
        let uid;
        let col = res.data.collections.find(c => c.name == collectionName);
        if (col) uid = col.uid;

        return uid;
      })
      .catch(error => console.log(error));
  },

  getEnvironmentUid: function (apiKey, environmentName) {
    return axios.get('https://api.getpostman.com/environments', { headers: { 'X-Api-Key': apiKey } })
      .then(res => {
        let uid;
        let env = res.data.environments.find(e => e.name == environmentName);
        if (env) uid = env.uid;

        return uid;
      })
      .catch(error => console.log(error));
  },

  runNewman: function (apiKey, collectionUid, environmentUid) {
    let response = getLatestFromPostman(apiKey, collectionUid, environmentUid);
    response.then(() => {
      let params = buildNewmanParams(environmentUid);

      newman.run(params, function (err) {
        if (err) throw err;

        // Clean up the collection and environment json files
        fs.unlink(collectionFile, err => {
          if(err) console.log("Unable to clean up " + collectionFile);
        });
        fs.unlink(environmentFile, err => {
          if(err) console.log("Unable to clean up " + environmentFile)
        });
      });
    });
  }
};

async function getLatestFromPostman(apiKey, collectionUid, environmentUid) {
  let promises = [];
  promises.push(downloadPostmanJson(apiKey, "collections", collectionUid, collectionFile));

  if (environmentUid) {
    promises.push(downloadPostmanJson(apiKey, "environments", environmentUid, environmentFile));
  }

  return Promise.all(promises);
}

function buildNewmanParams(hasEnvironmentUid) {
  let params = {
    collection: collectionFile,
    reporters: 'cli'
  };

  if (hasEnvironmentUid) params.environment = environmentFile;

  return params;
}

async function downloadPostmanJson(apiKey, method, identifier, fileName) {
  let response = await axios.get('https://api.getpostman.com/' + method + '/' + identifier, { headers: { 'X-Api-Key': apiKey } });
  fs.writeFileSync(fileName, JSON.stringify(response.data), (err) => {
    if (err) console.log("Unable to store create '" + fileName + "' locally.");
  });
}

async function loadCollectionFromPostman(apiKey, collectionName) {
  let getPromise = axios.get('https://api.getpostman.com/collections', { headers: { 'X-Api-Key': apiKey } });
  let collectionIdPromise = getPromise.then(response => {
    let uid;
    let collection = response.data.collections.find(col => col.name == collectionName);
    if (collection) uid = collection.uid;

    return uid;
  })
    .catch(error => console.log(error));

  return collectionIdPromise;
}

async function loadEnvironmentFromPostman(apiKey, environmentName) {
  axios.get('https://api.getpostman.com/environments', { headers: { 'X-Api-Key': apiKey } })
    .then(response => {
      let uid;
      let environment = response.data.environments.find(env => env.name == environmentName);
      if (environment) uid = environment.uid;
      let executionData = fs.readFileSync("execution.json");
      let execution = JSON.parse(executionData);
      execution.collectionUid = uid;
      fs.writeFileSync("execution.json", execution);
      return uid;
    })
    .catch(error => console.log(error));
}

