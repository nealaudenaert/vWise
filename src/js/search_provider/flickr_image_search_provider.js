define(function (require) {

    var Promise = require('promise');
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
        search: function (query) {
            var _this = this;

            return this._photoSearch(query).map(function (photo) {
                return _this._getSizes(photo.id).then(function (sizes) {
                    var largest = _.last(sizes);

                    return {
                        title: photo.title,
                        width: largest.width / 4,
                        height: largest.height / 4,
                        lockAspectRatio: true,
                        content: new ImageContentView({
                            uri: largest.source
                        })
                    };
                });
            }).catch(function (err) {
                console.error(err);
                alert('unable to fetch photos');
            });
        },

        _flickrAPI: function (method, options) {
            var apiOptions = _.extend({}, options, {
                format: 'json',
                api_key: this.apiKey,
                nojsoncallback: 1,
                method: method
            });

            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: 'https://api.flickr.com/services/rest/',
                    method: 'POST',
                    data: apiOptions,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            }).then(function (data) {
                if (data.stat !== 'ok') {
                    throw new Error(data.message);
                }

                return data;
            });
        },

        _photoSearch: function (query) {
            return this._flickrAPI('flickr.photos.search', {
                media: 'photos',
                safe_search: 1,     // safe photos for live demo
                privacy_filter: 1,  // public photos
                text: query,
                per_page: this.numResults,
                sort: 'relevance'
            }).then(function (data) {
                return data.photos.photo;
            });
        },

        _getSizes: function (photoId) {
            return this._flickrAPI('flickr.photos.getSizes', {
                photo_id: photoId
            }).then(function (data) {
                return data.sizes.size;
            });
        }

    });


    return FlickrImageSearchProvider;

});
