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

var exec = require('child_process').exec;

var trim = require('util/misc').trim;

exports.get = function(done) {
  /* Return runit services path if runsvdir is running, false otherwise */
  exec('ps aux | grep runsvdir | grep -v grep', function(err, stdout, stderr) {
    var matches, services_path;

    if (err) {
      done({runit_services_path: false});
      return;
    }

    matches = stdout.match(/runsvdir (\-p) (.*?) /i);

    if (matches === null || matches.length !== 3) {
      done({runit_services_path: false});
      return;
    }

    services_path = matches[2];
    done({runit_services_path: services_path});
  });
};