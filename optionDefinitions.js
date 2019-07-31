/*jshint esversion: 6 */
const optionDefinitions = [
  { name: 'api-key', alias: 'a', type: String },
  { name: 'collection-uid', type: String },
  { name: 'environment-uid', type: String },
  { name: 'collection-name', alias: 'c', type: String },
  { name: 'environment-name', alias: 'e', type: String },
  { name: 'set-api-key', type: String },
  { name: 'clear-api-key', type: Boolean }
];
module.exports = optionDefinitions;