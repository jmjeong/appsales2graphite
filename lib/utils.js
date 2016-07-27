/**
 * Created by jmjeong on 2016. 7. 27..
 */

var fs = require('fs');
var parse = require('csv-parse');
var path = require('path');
var moment = require('moment');

function readCsv(filename, cb) {
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) return cb({});
        
        var result = {};
        parse(data, {delimiter: '\t', auto_parse: true, columns: true}, function(err, data) {
            data.forEach(function(one) {
                var key = 'app.';
                sku = one.SKU.replace(/\./g, '-').trim()
                key += sku+'.';
                key += one['Product Type Identifier']+'.';
                key += one['Country Code'];
                if (result[key]) result[key] += one.Units;
                else result[key] = one.Units;
            });

            var time = moment(filename, 'MM-DD-YYYY').unix()*1000;

            // console.log(result, filename);

            cb({metric: result, time:time});
        })
    });
}

module.exports.readCsv = readCsv;