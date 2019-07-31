/*jshint esversion: 6 */
let fs = require('fs');
const settingsFile = 'settings.json';

module.exports = { 
  setApiKey: function (apiKey) {
    let settings = {};
    settings.apiKey = apiKey;
    fs.writeFileSync(settingsFile, JSON.stringify(settings));
  },

  getApiKey: function () {
    if (fs.existsSync(settingsFile)) {
      let settingsData = fs.readFileSync(settingsFile);
      let settings = JSON.parse(settingsData);
      return settings.apiKey;
    }
  },

  clearApiKey: function(){
    if(fs.existsSync(settingsFile)){
      fs.unlinkSync(settingsFile);
    }
  }
};