/*jshint esversion: 6 */
const optionDefinitions = require('../src/optionDefinitions.js');

test('Command line arguments are defined', () => {
  expect(optionDefinitions.definitions.length).toBeGreaterThan(1);
});

test('Help text is displayed', () => {
  expect(optionDefinitions.showHelp()).toEqual(expect.anything());
});