/*jshint esversion: 8 */
let axios = require('axios');
let fs = require('fs');

module.exports = {
  getLiveVersion: async function (apiKey, collectionUid, environmentUid) {
    let promises = [];
    promises.push(downloadPostmanJson(apiKey, "collections", collectionUid, "collection.json"));

    if (environmentUid){
      promises.push(downloadPostmanJson(apiKey, "environments", environmentUid, "environment.json"));
    }

   return Promise.all(promises);
  },

  buildNewmanParams: function(hasEnvironmentUid){
    let params = {
      collection: './collection.json',
      reporters: 'cli'
    };
   
    if(hasEnvironmentUid) params.environment = './environment.json';

    return params;
  }
};

async function downloadPostmanJson(apiKey, method, identifier, fileName) {
  let response = await axios.get('https://api.getpostman.com/' + method + '/' + identifier, { headers: { 'X-Api-Key': apiKey } });
  fs.writeFileSync(fileName, JSON.stringify(response.data), (err) => {
    if (err) console.log("Unable to store create '" + fileName + "' locally.");
  });
}