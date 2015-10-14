/**
 * enb-favicons
 * ============
 *
 * **Options**
 * Options are the same as in `favicons` package, except `target` (for enb tech process).
 *
 * * *Object* **files** — Paths to files. There are required fields: `src` & `dest`.
 * * *Object* **icons** — Icon types.
 * * *Object* **settings** — Additional settings.
 * * *Object* **favicon_generation** — Complete JSON overwrite for the favicon_generation object.
 * * *String* **target** — Target for technology. Required option.
 *
 */

var defaults = require('lodash.defaults');
var favicons = require('favicons');
var posthtml = require('posthtml');
var repeat = require('lodash.repeat');
var stringifyObj = require('stringify-object');
var vow = require('vow');

module.exports = require('enb/lib/build-flow').create()
    .name('enb-favicons')
    .target('target')

    .builder(function() {
        var _this = this;
        var def = vow.defer();
        var options = defaults(this._options || {}, {
            files : {
                src : null,
                dest : null,
                html : null,
                iconsPath : null,
                androidManifest : null,
                browserConfig : null,
                firefoxManifest : null,
                yandexManifest : null
            },
            icons : {
                android : true,
                appleIcon : true,
                appleStartup : true,
                coast : true,
                favicons : true,
                firefox : true,
                opengraph : true,
                windows : true,
                yandex : true
            },
            settings : {
                appName : null,
                appDescription : null,
                developer : null,
                developerURL : null,
                version : 1.0,
                background : null,
                index : null,
                url : null,
                silhouette : false,
                logging : true
            },
            favicon_generation : null,
            target : null
        });

        if (options.files.html) {
            favicons(options, function (error, metadata) {
                if (error) {
                    console.error('Error: ' + error.favicon_generation_result.result.error_message);
                    def.reject();
                } else {
                    def.resolve(_this.getTpl(metadata));
                }
            });
        } else {
            favicons(options, function (metadata) {
                def.resolve(_this.getTpl(metadata));
            });
        }

        return def.promise();
    })

    .methods({
        getTpl : function(metadata) {
            var tree = posthtml([
                function (tree) {
                    var arr = [];

                    tree.walk(function (node) {
                        if (/\n/gm.test(node)) return false;
                        arr.push(node);
                        return node;
                    });

                    return arr;
                }
            ]).process(metadata, { sync : true }).tree;

            var result = stringifyObj(tree)
                        .replace(/^\t{1}/g, repeat(' ', 8))
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