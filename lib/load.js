'use strict';
var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var _ = require('lodash');
var errors = require('./helpers/errors');

// Public
module.exports = function load(tasks) {
  if (_.isPlainObject(tasks)) {
    parseObject(tasks);
  } else if (_.isString(tasks)) {
    yamlOrJson(tasks);
  } else {
    throw new Error('load only accepts a JSON Object or a String filepath');
  }
};


// Private
function yamlOrJson(file) {
  var ext = path.extname(file);
  if (ext == ".yml" || ext == ".yaml") {
    parseYamlFile(file);
  } else if (ext == ".json") {
    parseJsonFile(file);
  } else {
    throw new Error('load only accepts YAML and JSON files');
  }
}

function parseObject(tasks) {
  for (var i = 0; i < Object.keys(tasks).length; i++) {
    var key = Object.keys(tasks)[i];

    errors.checkDefined(tasks[key].remote, 'remote must be defined');
    errors.checkDefined(tasks[key].cwd, 'cwd must be defined');
    errors.checkDefined(tasks[key].commands, 'commands must be defined');
    errors.checkArray(tasks[key].commands, 'commands must be defined as an array');
  }

  taskConcat(tasks);
}

function parseJsonFile(file) {
  var parsedJson = require(file);
  parseObject(parsedJson);
}

function parseYamlFile(file) {
  try {
    var parsedJson = yaml.safeLoad(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    throw new Error('Failed to parse YAML file: ' + e);
  }
  parseObject(parsedJson);
}

function taskConcat(tasks) {
  for (var attrname in tasks) { global.taskList[attrname] = tasks[attrname]; }
}
