/**
 * Created by jmjeong on 2016. 7. 27..
 */

var fs = require('fs');
var parse = require('csv-parse');
var path = require('path');
var graphite = require('graphite');
var async = require('async');
var _ = require('lodash');
var utils = require('./lib/utils');

var data_dir = './nemus-sales-rawdata';

var graphiteClient = graphite.createClient('plaintext://g.jmjeong.com:2003/');
var files = fs.readdirSync(data_dir);
var arr = [];

files.forEach(function(f) {
    if (!/^S_D_/.test(f)) return;

    arr.push(function(cb) {
        console.log('Processing ', f);

        utils.readCsv(path.join(data_dir,f), function(ret) {
            if (_.keys(ret).length == 0 ) return cb();
            graphiteClient.write(ret.metric, ret.time, function(err) {
                if (err) throw err;
                return cb();
            });
        });
    });
});

async.series(arr, function() {
    console.log('Job Done');
    graphiteClient.end();
});
