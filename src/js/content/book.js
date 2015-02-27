define(function (require) {

    var Marionette = require('marionette');
    var _ = require('underscore');
    var $ = require('jquery');


    var HATHITRUST_EMBED_API_ENDPOINT = 'http://babel.hathitrust.org/cgi/pt';


    var BookContentView = Marionette.ItemView.extend({
        template: false,

        tagName: 'iframe',

        initialize: function (opts) {
            opts = opts || {};

            if (!opts.bookId) {
                throw new TypeError('no book ID provided');
            }

            _.extend(this, _.pick(opts, 'bookId'));
        },

        onBeforeShow: function () {
            var params = {
                id: this.bookId,
                ui: 'embed'
            };

            this.$el.attr('src', HATHITRUST_EMBED_API_ENDPOINT + '?' + $.param(params));
        }
    });

    return BookContentView;

});
