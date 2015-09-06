# enb-favicons

[ENB](https://github.com/enb-make/enb) technology for favicons generation. Wrapper around [favicons](https://github.com/haydenbleasel/favicons) package.

## Installing

```
npm install --save-dev enb-favicons
```

## Options
Options are the same as in `favicons` package, except `target` (for enb tech process).

* *Object* **files** — Paths to files. There are required fields: `src` & `dest`.
* *Object* **icons** — Icon types.
* *Object* **settings** — Additional settings.
* *Object* **favicon_generation** — Complete JSON overwrite for the favicon_generation object.
* *String* **target** — Target for technology. Required option.

## Example

```javascript
config.node('src/blocks/common.blocks/favicons', function(nodeConfig) {
    nodeConfig.addTech(require('enb-favicons/techs/enb-favicons'), {
        files : {
            src : 'public/favicons/src/favicon.png',
            dest : 'public/favicons/dest/',
            html : 'public/favicons/dest/favicons.html',
            iconsPath : '/favicons/dest/'
        },
        target : '?.bemhtml'
    });
    nodeConfig.addTargets([ '?.bemhtml' ]);
});
```