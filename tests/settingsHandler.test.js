/*jshint esversion: 6 */
const settings = require('../src/settingsHandler.js');

test('Api key saves successfully', () =>{
  expect(settings.setApiKey("TestKey")).toBe(true);
});

test('Valid Api key is returned', () =>{
  expect(settings.getApiKey()).toBe('TestKey');
});

test('Overwrite existing api key', () =>{
  expect(settings.setApiKey("ExampleKey")).toBe(true);
});

test('Overwritten key returns', () => {
  expect(settings.getApiKey()).toBe('ExampleKey');
});

test('Delete existing api key', () =>{
  expect(settings.clearApiKey()).toBe(true);
});

test('Try to delete non-existant api key', () =>{
  expect(settings.clearApiKey()).toBe(false);
});

test('Nothing returned when no api key is saved', () =>{
  expect(settings.getApiKey()).toBe(undefined);
});