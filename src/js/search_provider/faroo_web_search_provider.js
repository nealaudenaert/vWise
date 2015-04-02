define(function (require) {

    var Promise = require('promise');
    var _ = require('underscore');

    var WebContentView = require('content/web');


    function FarooWebSearchProvider(options) {
        var opts = _.defaults(options || {}, {
            numResults: 10
        });

        if (!opts.apiKey) {
            throw new TypeError('no API key provided');
        }

        _.extend(this, _.pick(opts, 'apiKey', 'numResults'));
    }

    _.extend(FarooWebSearchProvider.prototype, {
        search: function (query) {
            return this._getResults(query).map(function (result) {
                return {
                    title: result.title,
                    width: 800,
                    height: 600,
                    content: new WebContentView({
                        uri: result.url
                    })
                };
            });
        },

        _getResults: function (query) {
            var farooOptions = {
                src: 'web',
                key: this.apiKey,
                q: query,
                length: this.numResults
            };

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: 'http://www.faroo.com/api',
                    method: 'GET',
                    data: farooOptions,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            }).then(function (data) {
                return data.results;
            });
        }
    });

    return FarooWebSearchProvider;

});
