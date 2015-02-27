define(function (require) {

    var Marionette = require('marionette');
    var _ = require('underscore');


    var ImageContentView = Marionette.ItemView.extend({
        template: false,

        tagName: 'img',

        initialize: function (opts) {
            opts = opts || {};

            if (!opts.uri) {
                throw new TypeError('no image URI provided');
            }

            _.extend(this, _.pick(opts, 'uri'));
        },

        onBeforeShow: function () {
            this.$el.attr('src', this.uri);
        }
    });

    return ImageContentView;

});
