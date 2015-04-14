# Visual Workspace for Information Seeking and Exploration (vWise)

A JavaScript based windowing framework to load data from external APIs and display them in a
"spatial hypertext"-ey manner.

## Build Instructions

Depends on [Node.js][], [Bower][], and [Gulp][] (in that order):

1. `npm install`
2. `bower install`
3. `gulp`


## Usage

Modify configuration settings in `src/js/config.js` prior to build (if building from scratch) or in
`dist/js/config.js` if already built.


### CORS Helper

The `cors_helper.js` script launches a HTTP server (default port: 9999) to proxy requests to web
services that do not allow for cross-origin resource sharing.


### Keyboard Shortcuts

* `ctrl+space`, `cmd-space` (on Mac), `/`: open quick search
* `esc`: close quick search
* `n`: create new notes editor
* `: q`: close all windows (inspired by Vim)


### Search Provider Keywords

* `web` (default): [Faroo][] web search
* `w`, `wiki`, `wikipedia`: [Wikipedia][] article search (requires CORS helper)
* `i`, `img`, `image`, `images`, `pic`, `photo`, `photos`, `flickr`: [Flickr][] photo search
* `map`: [Google Maps][] (geocoder API) search
* `v`, `video`, `videos`, `youtube`: [YouTube][] video search
* Enter URL starting with `http://` or `https://` to open that URL in a window


### Save / Load

Type `save()` (alias: `export()`) in the developer console to get a JSON
string representing the current state of the application.

Supply this string (or simply the JSON literal) as the argument to `load()`
(alias: `import()`) to restore that workspace state (does not close existing
windows in workspace).


[bower]: http://bower.io
[faroo]: http://www.faroo.com
[flickr]: https://www.flickr.com
[google maps]: https://www.google.com/maps
[gulp]: http://gulpjs.com
[node.js]: https://nodejs.org
[vim-close-all]: http://vim.wikia.com/wiki/Save_all_open_buffers_at_once
[wikipedia]: https://en.wikipedia.org
[youtube]: https://www.youtube.com
