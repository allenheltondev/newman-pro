/*jshint esversion: 6 */
const commandLineUsage = require('command-line-usage');
module.exports = {
  definitions: [
    { name: 'api-key', alias: 'a', type: String },
    { name: 'collection-uid', type: String },
    { name: 'environment-uid', type: String },
    { name: 'collection-name', alias: 'c', type: String },
    { name: 'environment-name', alias: 'e', type: String },
    { name: 'set-api-key', type: String },
    { name: 'clear-api-key', type: Boolean },
    { name: 'show-api-key', type: Boolean },
    { name: 'bail', alias: 'b', type: Boolean },
    { name: 'reporter', alias: 'r', type: String },
    { name: 'list-collections', type: Boolean },
    { name: 'help', alias: 'h', type: Boolean }
  ],

  showHelp: function () {
    const sections = [
      {
        header: 'Newman-Pro Help',
        content: 'Run newman with your Postman pro api key to always run against the latest and greatest collections and environments'
      },
      {
        header: 'Options',
        optionList: [
          {
            name: 'api-key',
            alias: 'a',
            description: 'Set the Postman Pro api key for a single invocation'
          },
          {
            name: 'collection-name',
            alias: 'c',
            description: 'Name of the collection to run'
          },
          {
            name: 'environment-name',
            alias: 'e',
            description: 'Name of the environment in which to run the collection'
          },
          {
            name: 'collection-uid',
            description: 'Uid of the collection to run. Takes precedence over "collection-name"'
          },
          {
            name: 'environment-uid',
            description: 'Uid of the environment in which to run the collection. Takes precedence over "environment-name"'
          },
          {
            name: 'bail',
            alias: 'b',
            description: 'Abort newman at first test failure',
            type: Boolean
          },
          {
            name: 'reporter',
            alias: 'r',
            description: 'The type of reporter to build the newman results in',
            type: Boolean
          }
        ]
      },
      {
        header: 'Commands',
        optionList: [
          {
            name: 'set-api-key',
            description: 'Set the Postman Pro api key permanently',
            type: Boolean
          },
          {
            name: 'show-api-key',
            description: 'Show the last 4 letters of the saved api key',
            type: Boolean
          },
          {
            name: 'clear-api-key',
            description: 'Clear the saved Postman Pro api key',
            type: Boolean
          },
          {
            name: 'list-collections',
            description: 'Lists all collections associated to the Postman account, and allows the user to select one to run',
            type: Boolean
          },
          {
            name: 'help',
            alias: 'h',
            description: 'Display this usage guide',
            type: Boolean
          }
        ]
      },
      {
        header: "Example Usage",
        content: [
          "$ newman-pro --collection-name {bold 'Integration Tests'} [-e {bold 'Dev Env'}]",
          "$ newman-pro --api-key {bold xYzAbC123} --list-collections",
          "$ newman-pro -a {bold xYzAbC123} -c {bold 'Example Collection'}",
          "$ newman-pro --show-api-key"
          
        ]
      },
      {
        content: 'Project home: {underline https://github.com/allenheltondev/newman-pro}'
      }
    ]
    const usage = commandLineUsage(sections)
    console.log(usage)
  }
}; 

