/**
 * Created by jmjeong on 2016. 7. 27..
 */

var fs = require('fs');
var graphite = require('graphite');
var utils = require('./lib/utils');
var path = require('path');
var _ = require('lodash');

var data_dir = './nemus-sales-rawdata';

fs.watch(data_dir, function(action, f) {
    var graphiteClient = graphite.createClient('plaintext://g.jmjeong.com:2003/');
    utils.readCsv(path.join(data_dir,f), function(ret) {
        if (_.keys(ret).length == 0 ) return;
        graphiteClient.write(ret.metric, ret.time, function(err) {
            if (err) throw err;
            graphiteClient.end();
        });
    });
});


