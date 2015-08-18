/* /lib/index.js
 * 
 * This file acts as a header file in a C program.
 * Now you can just require this directory.
 * 
 * From an outer module:
 * var includes = require('./lib');
 * var moduleX = includes.moduleX;
 */
var ls = require('fs').readdirSync;
var cwd = module.filename.split('/').slice(0,-1).join('/');
var files = ls(cwd).filter(function (fd) {
                var liveFile = true;
                var parts = fd.split('.');
                // Filter tmp, hidden, and self
                if (fd.charAt(0) === '#'
                  || fd.charAt(0) === '.'
                  || fd === 'index.js') {
                    return false;
                } if (parts.length > 1
                    && parts[parts.length - 1].substr(0,2) !== 'js') {
                    return false;
                }else {
                    return true;
                }
            });

files.forEach(function (fd) {
    // Remove .js & .json
    var fd = fd.split('.')[0];

    // Turn-hyphens into camelCase
    var words = fd.match(/\w+/gi);
    var name = words.shift();
    var _cur;
    while (_cur = words.shift()) {
        _cur = _cur[0].toUpperCase() + _cur.substr(1);
        name += _cur;
    }

    module.exports[name] = require('./' + fd);
});
                    
