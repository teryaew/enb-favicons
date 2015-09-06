/**
 * enb-favicons
 * ============
 *
 * ENB technology for favicons generation. Wrapper around [favicons](https://github.com/haydenbleasel/favicons) package.
 * Requirements for favicons source (master) picture:
 * 1. Should be square
 * 2. Should be at least 57x57 (for ios), 70x70 (windows), 228x228 (coast), 300x300 (open_graph).
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
 * **Example**
 *
 * ```javascript
 * config.node('src/blocks/common.blocks/favicons', function(nodeConfig) {
 *     nodeConfig.addTech(require('enb-favicons/techs/enb-favicons'), {
 *         files : {
 *             src : 'public/favicons/src/favicon.png',
 *             dest : 'public/favicons/dest/',
 *             html : 'public/favicons/dest/favicons.html',
 *             iconsPath : '/favicons/dest/'
 *         },
 *         target : '?.bemhtml'
 *     });
 *     nodeConfig.addTargets([ '?.bemhtml' ]);
 * });
 * ```
 */

var defaults = require('lodash.defaults');
var favicons = require('favicons');
var html2bemjson = require('html2bemjson');
var repeat = require('lodash.repeat');
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
            var bemjson = html2bemjson
                            .stringify(metadata)
                            .replace(/^\s{4}/gm, repeat(' ', 8))
                            .replace(/]$/g, repeat(' ', 4) + ']');

            return [
                'block(\'favicons\').def()(function() {',
                '    applyCtx(' + bemjson + ');',
                '})'
            ].join('\n');
        }
    })

    .createTech();