define(function (require) {

    var Promise = require('promise');
    var $ = require('jquery');
    var _ = require('underscore');

    var MapContentView = require('content/map');


    function MapSearchProvider(options) {
        var opts = _.defaults(options, {

        });

        if (!opts.apiKey) {
            throw new TypeError('no Google API key provided');
        }

        _.extend(this, _.pick(options, 'apiKey'));
    }

    _.extend(MapSearchProvider.prototype, {
        search: function (query) {
            var _this = this;

            var resultsPromise = new Promise(function (resolve, reject) {
                var searchOptions = {
                    address: query,
                    key: _this.apiKey
                };

                $.ajax({
                    method: 'GET',
                    // should use places API, but it doesn't support CORS
                    // url: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
                    url: 'https://maps.googleapis.com/maps/api/geocode/json',
                    data: searchOptions,
                    dataType: 'json',
                    success: resolve,
                    error: reject
                });
            }).then(function (data) {
                if (data.status !== 'OK') {
                    console.log(data);
                    throw new Error('unable to fetch map search results: ' + (data.error_message || data.status));
                }

                return data.results;
            });

            return resultsPromise.map(function (result) {
                return {
                    title: result.formatted_address,
                    width: 800,
                    height: 600,
                    content: new MapContentView({
                        apiKey: _this.apiKey,
                        lat: result.geometry.location.lat,
                        lon: result.geometry.location.lng
                    })
                };
            }).catch(function (err) {
                console.error(err);
                alert('could not fetch map');
            });
        }
    });


    return MapSearchProvider;

});
