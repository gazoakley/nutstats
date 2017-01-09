'use strict';

var nuts = require('./nuts.json');

module.exports.getName = function (code) {
    return nuts[code];
}

function getPathParts(code) {
    var path = [];
    var lastIndex = 0;
    for (var i = 2; i <= code.length; i++) {
        var part = code.substring(lastIndex, i);
        path.push(part);
        lastIndex = i;
    }
    return path;
}

module.exports.getParents = function (code) {
    var parts = getPathParts(code);
    var results = [];
    for (var i = 1; i <= parts.length; i++) {
        var path = parts.slice(0, i);
        var subcode = path.join('');
        var result = {
            code: subcode,
            name: nuts[subcode]
        }
        results.push(result);
    }
    return results;
};

function getPath(code) {
    var path = [];
    var lastIndex = 0;
    for (var i = 2; i <= code.length; i++) {
        if (i > 2) {
            path.push('nodes');
        }
        var part = code.substring(lastIndex, i);
        path.push(part);
        lastIndex = i;
    }
    return path;
}

function setProps(object, path, value) {
    var subObject = object;
    for (var i = 0; i < path.length; i++) {
        var part = path[i];
        if (!(part in subObject)) {
            subObject[part] = {};
        }
        if (i < path.length - 1) {
            subObject = subObject[part];
        } else {
            subObject[part] = value;
        }
    }
    return object;
}

module.exports.getChildren = function () {
    var result = {};
    for (var code in nuts) {
        if (!nuts.hasOwnProperty(code)) continue;
        var path = getPath(code);
        setProps(result, path.concat('code'), code);
        setProps(result, path.concat('name'), nuts[code]);
    }
    return result;
};
