define(function (require) {

    var Marionette = require('marionette');
    var _ = require('underscore');


    var YoutubePlayerContentView = Marionette.ItemView.extend({
        template: false,

        tagName: 'iframe',

        attributes: {
            controls: true
        },

        initialize: function (options) {
            var opts = _.defaults(options || {}, {
            });

            if (!opts.videoId) {
                throw new TypeError('no video ID provided');
            }

            _.extend(this, _.pick(opts, 'videoId'));
        },

        onBeforeShow: function () {
            this.$el.attr('src', 'http://www.youtube.com/embed/' + this.videoId);
        }
    });

    return YoutubePlayerContentView;

});
