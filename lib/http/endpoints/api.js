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

var http = require('services/http');
var httputil = require('util/http');

var route = http.route;

// @TODO: re-enable this endpoint when we figure out a nice way to get a list of
// all the paths in Express.

/*
 * Return available API versions and methods.
 */
function apiMethods(req, res) {
  var apiInfo = {
    'current_api_version': http.CURRENT_API_VERSION,
    'available_api_versions': http.apiVersions,
    'api_methods': {}
  };

  apiInfo.apiMethods = http.apiMethods;
  httputil.returnJson(res, 200, apiInfo);
}

var urls = route([
   ['GET /$', '1.0', apiMethods]
]);

exports.apiMethods = apiMethods;
exports.urls = urls;
