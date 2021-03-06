/*
 * Licensed to Cloudkick, Inc ('Cloudkick') under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * Cloudkick licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require('fs');
var sys = require('sys');
var path = require('path');
var constants = require('constants');

var sprintf = require('sprintf').sprintf;
var async = require('async');

var serviceManagement = require('service_management');
var misc = require('util/misc');
var Errorf = misc.Error;
var SupervisedService = require('service_management/base').SupervisedService;
var SupervisedServiceManager = require('service_management/base').SupervisedServiceManager;

function MockService(pathAvailable, pathEnabled, name) {
  SupervisedService.call(this, pathAvailable, pathEnabled, name);

  this.pathAvailable = path.join(this._basePathAvailable, this.name);
  this.pathEnabled = path.join(this._basePathEnabled, this.name);

  this._pid = (Math.random() * 10000);
  this._state = 'down';
  this._enabled = false;
}

sys.inherits(MockService, SupervisedService);

MockService.prototype.getLogPath = function() {
  return '';
};

MockService.prototype.getStatus = function(callback) {
  var status = {
    'time': 1234567,
    'pid': this._pid,
    'state': this._state
  };

  if (!this._enabled) {
    callback(null, null);
    return;
  }

  callback(null, status);
};

MockService.prototype.isEnabled = function(callback) {
  callback(this._enabled);
};

MockService.prototype.restart = function(callback) {
  var self = this;

  this.stop(function(err) {
    self.start(callback);
  });
};

MockService.prototype.start = function(callback) {
  this._state = 'running';
  callback(null);
};

MockService.prototype.stop = function(callback) {
  this._state = 'down';
  callback(null);
};

MockService.prototype.kill = function(callback) {
  callback(null);
};

MockService.prototype.enable = function(callback) {
  this._enabled = true;
  callback(null);
};

/**
 * Disable a service by removing the symlink to it from the enabled directory
 *
 * @param {Function} callback A callback with a possible error.
 */
MockService.prototype.disable = function(callback) {
  this._enabled = false;
  callback(null);
};

MockService.prototype.destroy = function(callback) {
  callback(null);
};

function MockServiceManager(pathAvailable, pathEnabled) {
  SupervisedServiceManager.call(this, pathAvailable, pathEnabled);

  this._services = {};
}

sys.inherits(MockServiceManager, SupervisedServiceManager);

MockServiceManager.prototype.getService = function(name, callback) {
  var service;

  if (this._services.hasOwnProperty(name)) {
    service = this._services[name];
  }
  else {
    service = new MockService(this.pathAvailable, this.pathEnabled, name);
  }

  callback(null, service);
};

MockServiceManager.prototype.getServiceTemplate = function(templateArgs, callback) {
  callback(null, {});
};

MockServiceManager.prototype.createService = function(serviceName, serviceTemplate, callback) {
  var service = new MockService(this.pathAvailable, this.pathEnabled,
                                serviceName);
  this._services[serviceName] = service;
  callback(null);
};

var manager = null;

function getManager(pathAvailable, pathEnabled) {
  if (!manager) {
    manager = new MockServiceManager(pathAvailable, pathEnabled);
  }

  return manager;
}

exports.configDefaults = {};
exports.getManager = getManager;
exports.MockService = MockService;
exports.MockServiceManager = MockServiceManager;
