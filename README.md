# enb-favicons

[ENB](https://github.com/enb-make/enb) technology for favicons generation.
Wrapper around [favicons](https://github.com/haydenbleasel/favicons) package.

## Notes

Requirements for favicons source (master) picture:

1. Should be square.
2. Should be at least 57x57 (for ios), 70x70 (windows), 228x228 (coast), 300x300 (open_graph).

## Installation

```
npm install --save-dev enb-favicons
```

## Options
Options are the same as in `favicons` package, except for:
* `destination` (path to destination folder);
* `target` (needs for enb tech process).

## Example
You can run it in project with YENV environment variable

```
YENV=favicons enb make -n
```

and those lines in your `enb` config:

```javascript
if (config._env.YENV === 'favicons') {
    config.mode('favicons', function() {
        config.node('src/blocks/common.blocks/favicons', function(nodeConfig) {
            nodeConfig.addTech(
                [require('enb-favicons/techs/enb-favicons'), {
                    source : 'public/favicons/src/favicon.png',
                    configuration : {
                        path : 'favicons/dest',
                        logging : true
                    },
                    destination : 'public/favicons/dest/',
                    target : '?.bemhtml'
                }]
            );
            nodeConfig.addTargets([ '?.bemhtml' ]);
        });
    });
}
```

Finally, go to your `page` template and add block in `head` field:
```javascript
    {
        block : 'page',
        head : [
            { block : 'favicons' }
        ]
    }
```