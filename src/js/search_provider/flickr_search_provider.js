define(function (require) {

    var _ = require('underscore');
    var $ = require('jquery');

    var ImageContentView = require('content/image');


    function FlickrImageSearchProvider(options) {
        var opts = _.defaults(options, {
            numResults: 20
        });

        if (!opts.apiKey) {
            throw new TypeError('no api key given to Flickr image search provider');
        }

        _.extend(this, _.pick(opts, 'apiKey', 'numResults'));
    }

    _.extend(FlickrImageSearchProvider.prototype, {
        search: function (q) {
            var _this = this;

            var resultsPromise = new Promise(function (resolve, reject) {
                // flickr calls this their 'REST' API... nothing very RESTful about it.
                var flickrSearchOptions = {
                    format: 'json',
                    api_key: _this.apiKey,
                    method: 'flickr.photos.search',
                    media: 'photos',
                    nojsoncallback: 1,  // flickr defaults to using JSONP... why?
                    safe_search: 1,     // safe photos for live demo
                    privacy_filter: 1,  // public photos
                    text: q,
                    per_page: _this.numResults,
                    extras: 'url_k',
                    sort: 'relevance'
                };

                $.ajax({
                    url: 'https://api.flickr.com/services/rest/',
                    method: 'POST',
                    data: flickrSearchOptions,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            });

            return resultsPromise.then(function (data) {
                if (data.stat !== 'ok') {
                    throw new Error(data.message);
                }

                return _.chain(data.photos.photo)
                    .filter(function (photo) {
                        return _.has(photo, 'url_k');
                    })
                    .map(function (photo) {
                        return {
                            title: photo.title,
                            width: photo.width_k / 4,
                            height: photo.height_k / 4,
                            lockAspectRatio: true,
                            content: new ImageContentView({
                                uri: photo.url_k
                            })
                        };
                    })
                    .value();
            });
        }
    });


    return FlickrImageSearchProvider;

});
