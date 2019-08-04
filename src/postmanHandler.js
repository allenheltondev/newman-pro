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

  runNewman: function (apiKey, collectionUid, environmentUid, bail, reporter) {
    let response = getLatestFromPostman(apiKey, collectionUid, environmentUid);
    response.then(() => {
      let params = buildNewmanParams(environmentUid, bail, reporter);

      newman.run(params, function (err) {
        if (err) throw err;

        // Clean up the collection and environment json files
       cleanUpJsonFiles();
      });
    });
  },

  listCollections: function(apiKey){
    return axios.get('https://api.getpostman.com/collections', { headers: { 'X-Api-Key': apiKey } })
      .then(res => {
        return res.data.collections;        
      });
  },

  listEnvironments: function (apiKey) {
    return axios.get('https://api.getpostman.com/environments', { headers: { 'X-Api-Key': apiKey } })
    .then(res => {
      return res.data.environments;        
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

function buildNewmanParams(hasEnvironmentUid, bail, reporter) {
  let params = {
    collection: collectionFile,
    reporters: 'cli'
  };

  if (hasEnvironmentUid) params.environment = environmentFile;
  if (bail) params.bail = bail;
  if (reporter) params.reporters = reporter;

  return params;
}

async function downloadPostmanJson(apiKey, method, identifier, fileName) {
  let response = await axios.get('https://api.getpostman.com/' + method + '/' + identifier, { headers: { 'X-Api-Key': apiKey } });
  fs.writeFileSync(fileName, JSON.stringify(response.data), (err) => {
    if (err) console.log("Unable to store create '" + fileName + "' locally.");
  });
}

function cleanUpJsonFiles(){
  fs.unlink(collectionFile, err => {
    if (err) console.log("Unable to clean up " + collectionFile);
  });
  if (fs.existsSync(environmentFile)) {
    fs.unlink(environmentFile, err => {
      if (err) console.log("Unable to clean up " + environmentFile)
    });
  }
}
