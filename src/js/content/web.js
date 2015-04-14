define(function (require) {

    var Marionette = require('marionette');
    var _ = require('underscore');


    var WebContentView = Marionette.ItemView.extend({
        template: false,

        tagName: 'iframe',

        initialize: function (options) {
            var opts = _.defaults(options || {}, {

            });

            if (!opts.uri) {
                throw new TypeError('no URI specified');
            }

            _.extend(this, _.pick(opts, 'uri'));
        },

        onBeforeShow: function () {
            this.$el.attr('src', this.uri);
        },

        toJSON: function () {
            return {
                type: WebContentView.TYPE,
                opts: _.pick(this, 'uri')
            };
        }
    });

    _.extend(WebContentView, {
        TYPE: 'web'
    });

    return WebContentView;

});
