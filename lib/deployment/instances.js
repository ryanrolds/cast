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

var path = require('path');

var sprintf = require('extern/sprintf').sprintf;
var async = require('extern/async');

var config = require('util/config');
var fsutil = require('util/fs');

/*
 * Return an array of available instances for the given bundle.
 *
 * @param {String} bundle_name Name of the bundle
 * @param [Function] callback Callback which is called with a possible error as the first argument and an array of available instances
 *                            sorted by instance number as the second one (each item is a tuple of instance name and
 *                            instance number)
 *
 */
var get_available_instances = function(bundle_name, callback) {
  var applications_path = path.join(config.get().data_root, config.get().app_dir);

  fsutil.get_matching_files(applications_path, sprintf('%s-[0-9]+', bundle_name), false, function(error, files) {
    if (error) {
      return callback(error);
    }

    async.map(files, function(file, callback) {
      var splitted = file.split('-');

      callback(null, [splitted[0], splitted[1]]);
    },

    function(error, results) {
      if (error) {
        return callback(error);
      }

      var sorted = results.sort(function(a, b) { return a[1] - b[1]; });

      callback(null, sorted);
    });
  });
};

exports.get_available_instances = get_available_instances;