define(function (require) {

    var Marionette = require('marionette');
    var _ = require('underscore');
    var $ = require('jquery');


    var GOOGLE_MAP_EMBED_API_ENDPOINT = 'https://www.google.com/maps/embed/v1/view';


    var MapContentView = Marionette.ItemView.extend({
        template: false,

        tagName: 'iframe',

        initialize: function (options) {
            var opts = _.defaults(options || {}, {
                zoom: 16,
                lat: 30.6149,
                lon: -96.3423
            });

            if (!opts.apiKey) {
                throw new TypeError('no API key provided');
            }

            _.extend(this, _.pick(opts, 'apiKey', 'lat', 'lon', 'zoom'));
        },

        onBeforeShow: function () {
            var params = {
                key: this.apiKey,
                zoom: this.zoom,
                center: this.lat + ',' + this.lon
            };

            this.$el.attr('src', GOOGLE_MAP_EMBED_API_ENDPOINT + '?' + $.param(params));
        },

        toJSON: function () {
            return {
                type: MapContentView.TYPE,
                opts: _.pick(this, 'apiKey', 'lat', 'lon', 'zoom')
            };
        }
    });

    _.extend(MapContentView, {
        TYPE: 'map'
    });

    return MapContentView;

});
