define(function (require) {

    var _ = require('underscore');

    var config = require('config');

    var Mousetrap = require('mousetrap');

    var Loader = require('./content_loader');
    var Workspace = require('./workspace');

    var EditorContentView = require('./content/editor');

    var FarooWebSearchProvider     = require('./search_provider/faroo_web_search_provider');
    var FlickrImageSearchProvider  = require('./search_provider/flickr_image_search_provider');
    var GoogleMapSearchProvider    = require('./search_provider/google_map_search_provider');
    var OpenUrlWebSearchProvider   = require('./search_provider/open_url_web_search_provider');
    var WikipediaWebSearchProvider = require('./search_provider/wikipedia_web_search_provider');
    var YouTubeVideoSearchProvider = require('./search_provider/youtube_video_search_provider');

    Loader.addTypes([
        require('./content/book'),
        require('./content/image'),
        require('./content/map'),
        require('./content/video'),
        require('./content/web'),
        require('./content/youtube_player'),
        EditorContentView
    ]);


    var workspace = new Workspace({
        el: '.workspace',
        typeLoader: Loader
    });

    workspace.addSearchProvider('web', new FarooWebSearchProvider({
        apiKey: config.farooApiKey
    }));

    workspace.addSearchProvider(['w', 'wiki', 'wikipedia'], new WikipediaWebSearchProvider({
        corsHelper: config.corsHelperUrl,
        numResults: 1
    }));

    workspace.addSearchProvider(['i', 'img', 'image', 'images', 'pic', 'photo', 'photos', 'flickr'], new FlickrImageSearchProvider({
        apiKey: config.flickrApiKey
    }));

    workspace.addSearchProvider('map', new GoogleMapSearchProvider({
        apiKey: config.googleApiKey
    }));

    workspace.addSearchProvider(['v', 'video', 'videos', 'youtube'], new YouTubeVideoSearchProvider({
        apiKey: config.googleApiKey
    }));

    _.each(['http', 'https'], function (protocol) {
        workspace.addSearchProvider(protocol, new OpenUrlWebSearchProvider({
            protocol: protocol
        }));
    });


    Mousetrap.bind(['/', 'mod+space'], function (e) {
        e.preventDefault();
        workspace.openSearchBox();
    });

    Mousetrap.bind('esc', function (e) {
        e.preventDefault();
        workspace.closeSearchBox();
    });

    Mousetrap.bind('n', function (e) {
        e.preventDefault();
        var w = workspace.createWindow({
            title: 'Notes',
            autoHeight: true
        });

        var workspaceSize = workspace.getSize();
        w.setPosition(Math.random() * workspaceSize.width, Math.random() * workspaceSize.height);
        w.setSize(800);
        w.show(new EditorContentView());
    });

    Mousetrap.bind(': q a !', function () {
        workspace.closeAll();
    });


    window.save = window.export = function () {
        return JSON.stringify(workspace.getState());
    };

    window.load = window.import = function (json) {
        workspace.setState(_.isString(json) ? JSON.parse(json) : json);
    };

});
