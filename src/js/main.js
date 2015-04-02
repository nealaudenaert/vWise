define(function (require) {

    var config = require('config');

    var Mousetrap = require('mousetrap');

    var Workspace = require('./workspace');
    var BookContentView = require('./content/book');
    var MapContentView = require('./content/map');
    var ImageContentView = require('./content/image');
    var VideoContentView = require('./content/video');
    var EditorContentView = require('./content/editor');

    var FarooWebSearchProvider    = require('./search_provider/faroo_web_search_provider');
    var FlickrImageSearchProvider = require('./search_provider/flickr_image_search_provider');
    var GoogleMapSearchProvider   = require('./search_provider/google_map_search_provider');


    var workspace = new Workspace({ el: '.workspace' });

    workspace.addSearchProvider('web', new FarooWebSearchProvider({
        apiKey: config.farooApiKey
    }));

    workspace.addSearchProvider('flickr', new FlickrImageSearchProvider({
        apiKey: config.flickrApiKey
    }));

    workspace.addSearchProvider('map', new GoogleMapSearchProvider({
        apiKey: config.googleApiKey
    }));


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
            title: prompt('Enter a title:'),
            autoHeight: true
        });

        w.setPosition(100, 100);
        w.setSize(800);
        var notes = new EditorContentView();
        w.show(notes);
    });

    return;

    var w1 = workspace.createWindow({ title: 'HathiTrust Book Reader' });
    w1.setSize(600, 700);
    w1.setPosition(0, 0);

    var book = new BookContentView({
        bookId: 'uc2.ark:/13960/t3610x12d'
    });
    w1.show(book);


    var w2 = workspace.createWindow({ title: 'Google Maps' });
    w2.setSize(800, 600);
    w2.setPosition(30, 30);

    var map = new MapContentView({
        apiKey: config.googleApiKey
    });
    w2.show(map);


    var w3 = workspace.createWindow({ title: 'The Mona Lisa' });
    w3.setSize(515, 768);
    w3.lockAspectRatio();
    w3.setPosition(60, 60);

    var image = new ImageContentView({
        uri: 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg'
    });
    w3.show(image);


    var w4 = workspace.createWindow({ title: 'HTML5 Video' });
    w4.setSize(970, 430);
    w4.lockAspectRatio();
    w4.setPosition(90, 90);

    var video = new VideoContentView({
        autoplay: true,
        sources: [
            { uri: 'http://vjs.zencdn.net/v/oceans.mp4', type: 'video/mp4' },
            { uri: 'http://vjs.zencdn.net/v/oceans.webm', type: 'video/webm' }
        ]
    });
    w4.show(video);
});
