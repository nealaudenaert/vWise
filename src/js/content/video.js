define(function (require) {

    var Marionette = require('marionette');
    var _ = require('underscore');


    var VideoContentView = Marionette.ItemView.extend({
        template: false,

        tagName: 'video',

        attributes: {
            controls: true
        },

        initialize: function (options) {
            var opts = _.defaults(options || {}, {
                autoplay: false
            });

            if (!opts.sources || _.isEmpty(opts.sources)) {
                throw new TypeError('no video source URIs provided');
            }

            if (!_.all(opts.sources, function (s) { return _.has(s, 'uri') && _.has(s, 'type'); })) {
                throw new TypeError('source object must contain \'uri\' and \'type\' keys');
            }

            _.extend(this, _.pick(opts, 'sources', 'autoplay'));
        },

        onBeforeShow: function () {
            if (this.autoplay) {
                this.$el.attr('autoplay', true);
            }

            _.each(this.sources, function (src) {
                this.$el.append('<source src="' + src.uri + '" type="' + src.type + '">');
            }, this);
        },

        toJSON: function () {
            return {
                type: VideoContentView.TYPE,
                opts: _.pick(this, 'sources', 'autoplay')
            };
        }
    });

    _.extend(VideoContentView, {
        TYPE: 'video'
    });

    return VideoContentView;

});
