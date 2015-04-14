define(function (require) {

    var Promise = require('promise');
    var $ = require('jquery');
    var _ = require('underscore');

    var WebContentView = require('content/web');


    function WikipediaWebSearchProvider(options) {
        var opts = _.defaults(options || {}, {
            numResults: 10
        });

        if (!opts.corsHelper) {
            throw new TypeError('Wikipedia search provider must have CORS helper URL defined');
        }

        _.extend(this, _.pick(opts, 'corsHelper', 'numResults'));
    }

    _.extend(WikipediaWebSearchProvider.prototype, {
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
            var options = {
                limit: this.numResults,
                q: query
            };

            var _this = this;
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: _this.corsHelper + '/wikipedia',
                    method: 'GET',
                    data: options,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            });
        }
    });

    return WikipediaWebSearchProvider;

});
