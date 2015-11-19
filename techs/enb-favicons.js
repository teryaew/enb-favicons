/**
 * enb-favicons
 * ============
 *
 * Options are the same as in `favicons` package, except for:
 * `destination` (path to destination folder);
 * `target` (needs for enb tech process).
 *
 */

var buildFlow = require('enb').buildFlow || require('enb/lib/build-flow');
var defaults = require('lodash.defaults');
var favicons = require('favicons');
var fs = require('fs');
var path = require('path');
var posthtml = require('posthtml');
var repeat = require('lodash.repeat');
var stringifyObj = require('stringify-object');
var vow = require('vow');

module.exports = buildFlow.create()
    .name('enb-favicons')
    .target('target')

    .builder(function() {
        var _this = this;
        var def = vow.defer();
        var source = this._options.source || null;
        var configuration = defaults(this._options.configuration || {}, {
            appName : null,                  // Your application's name. `string`
            appDescription : null,           // Your application's description. `string`
            developerName : null,            // Your (or your developer's) name. `string`
            developerURL : null,             // Your (or your developer's) URL. `string`
            background : '#fff',             // Background colour for flattened icons. `string`
            path : '/',                      // Path for overriding default icons path. `string`
            url : '/',                       // Absolute URL for OpenGraph image. `string`
            display : 'standalone',          // Android display: "browser" or "standalone". `string`
            orientation : 'portrait',        // Android orientation: "portrait" or "landscape". `string`
            version : '1.0',                 // Your application's version number. `number`
            logging : false,                 // Print logs to console? `boolean`
            online : false,                  // Use RealFaviconGenerator to create favicons? `boolean`
            icons : {
                android : true,              // Create Android homescreen icon. `boolean`
                appleIcon : true,            // Create Apple touch icons. `boolean`
                appleStartup : true,         // Create Apple startup images. `boolean`
                coast : true,                // Create Opera Coast icon. `boolean`
                favicons : true,             // Create regular favicons. `boolean`
                firefox : true,              // Create Firefox OS icons. `boolean`
                opengraph : true,            // Create Facebook OpenGraph. `boolean`
                windows : true,              // Create Windows 8 tiles. `boolean`
                yandex : true                // Create Yandex browser icon. `boolean`
            }
        });

        favicons(source, configuration, function (error, response) {
            if (error) {
                console.error(error.name + '|' + error.message);
                def.reject();
            } else {
                response.images.forEach(function(favicon) {
                    fs.writeFileSync(path.join(_this._options.destination, favicon.name), favicon.contents);
                });
                def.resolve(_this.getTpl(response.html));
            }
        });

        return def.promise();
    })

    .methods({
        getTpl : function(metadata) {
            var tree = posthtml([
                function (tree) {
                    var arr = [];

                    tree.match({ tag : true }, function(node) {
                        arr.push(node);
                        return node;
                    });

                    return arr;
                }
            ]).process(metadata, { sync : true }).tree;

            var result = stringifyObj(tree)
                        .replace(/^\t{1}/gm, repeat(' ', 8))
                        .replace(/\t/gm, repeat(' ', 4))
                        .replace(/]$/g, repeat(' ', 4) + ']');

            return [
                'block(\'favicons\').def()(function() {',
                '    applyCtx(' + result + ');',
                '})'
            ].join('\n');
        }
    })

    .createTech();
