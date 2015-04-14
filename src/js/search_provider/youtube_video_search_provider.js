define(function (require) {

    var Promise = require('promise');
    var $ = require('jquery');
    var _ = require('underscore');

    var YoutubePlayerContentView = require('content/youtube_player');


    function YouTubeVideoSearchProvider(options) {
        var opts = _.defaults(options || {}, {
            numResults: 10
        });

        if (!opts.apiKey) {
            throw new TypeError('no API key provided');
        }

        _.extend(this, _.pick(opts, 'apiKey', 'numResults'));
    }

    _.extend(YouTubeVideoSearchProvider.prototype, {
        search: function (query) {
            return this._getResults(query).map(function (result) {
                return {
                    title: result.title,
                    width: 640,
                    height: 390,
                    lockAspectRatio: true,
                    content: new YoutubePlayerContentView({
                        videoId: result.id
                    })
                };
            });
        },

        _getResults: function (query) {
            var options = {
                part: 'snippet',
                safeSearch: 'strict',
                key: this.apiKey,
                maxResults: this.numResults,
                q: query
            };

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: 'https://www.googleapis.com/youtube/v3/search',
                    method: 'GET',
                    data: options,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            }).then(function (data) {
                return data.items;
            }).map(function (item) {
                return {
                    title: item.snippet.title,
                    id: item.id.videoId
                };
            });
        }
    });

    return YouTubeVideoSearchProvider;

});
