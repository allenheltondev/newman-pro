/*jshint esversion: 6 */
let fs = require('fs');
const settingsFile = 'settings.json';

module.exports = { 
  setApiKey: function (apiKey) {
    let settings = {};
    settings.apiKey = apiKey;
    fs.writeFileSync(settingsFile, JSON.stringify(settings));
    return true;    
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
      return true;
    }
    return false;
  },

  showApiKey: function () {
    if (fs.existsSync(settingsFile)) {
      let settingsData = fs.readFileSync(settingsFile);
      let settings = JSON.parse(settingsData);
      let key = "";
      for (i = 0; i < settings.apiKey.length; i++){
        if (i <= (settings.apiKey.length - 5))
          key += "X";
        else
          key += settings.apiKey[i];
      }
      return key;
    }
  }
};