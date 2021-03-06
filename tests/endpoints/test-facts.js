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

var control = require('control');
var testUtil = require('util/test');
var http = require('services/http');
var getServer = http.getAndConfigureServer;


control.facts = {
  getFacts: function(callback) {
    callback(null, {
      foo: 'bar'
    });
  }
};


exports['test_get'] = function(test, assert) {
  var req = testUtil.getReqObject('/facts/', 'GET');
  assert.responseJson(getServer(), req, function(res) {
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      foo: 'bar'
    });
    test.finish();
  });
};
