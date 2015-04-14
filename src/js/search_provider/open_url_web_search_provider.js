
define(function (require) {

    var Promise = require('promise');
    var _ = require('underscore');

    var WebContentView = require('content/web');


    function OpenUrlWebSearchProvider(options) {
        var opts = _.defaults(options || {}, {
            protocol: 'http'
        });

        _.extend(this, _.pick(opts, 'protocol'));
    }

    _.extend(OpenUrlWebSearchProvider.prototype, {
        search: function (url) {
            var _this = this;
            return Promise.resolve([{
                title: 'Web Browser',
                width: 800,
                height: 600,
                content: new WebContentView({
                    uri: _this.protocol + ':' + url
                })
            }]);
        }
    });

    return OpenUrlWebSearchProvider;

});
