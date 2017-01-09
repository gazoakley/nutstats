'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var parse = Promise.promisify(require('xml2js').parseString);
var path = require('path');

fs.readFileAsync(path.join(__dirname, 'NUTS_2016L.xml'), { encoding: 'utf8' })
    .then((xml) => {
        return parse(xml);
    })
    .then((parsed) => {
        var items = _.get(parsed, ['Claset', 'Classification', 0, 'Item']);
        return _.reduce(items, (result, item) => {
            if (_.get(item, ['Label', 'length']) !== 2) return result;
            var code = _.get(item, ['Label', 0, 'LabelText', 0, '_']);
            var description = _.get(item, ['Label', 1, 'LabelText', 0, '_']);
            result[code] = description;
            return result;
        }, {});
    })
    .then((nuts) => {
        return fs.writeFileAsync(path.join(__dirname, 'nuts.json'), JSON.stringify(nuts), { encoding: 'utf8' });
    });